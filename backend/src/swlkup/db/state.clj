(ns swlkup.db.state
  (:require[crux.api :as crux]
            [clojure.java.io :as io]
            [swlkup.db.export :refer [export seed]]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]))

(defn export-named-by-date [db_ctx]
  (when (:db-export-prefix env)
        (let [date (.format (java.text.SimpleDateFormat. "yyyy-MM-dd_HH:mm:ss")
                            (.getTime (java.util.Calendar/getInstance)))
              file (str (:db-export-prefix env) date ".edn")]
             (when (:verbose env)
                   (println "Export database to:" file))
             (export db_ctx file))))

(defn q [node & args]
        (apply crux/q (crux/db node) args))

(defn ->db_ctx []
  (let [node (crux/start-node (when-not (:db-inmemory env)
                                        {:my-rocksdb {:crux/module 'crux.rocksdb/->kv-store
                                                      :db-dir (clojure.java.io/file (:db-dir env))
                                                      :sync? true}
                                         :crux/tx-log {:kv-store :my-rocksdb}
                                         :crux/document-store {:kv-store :my-rocksdb}}))
        db_ctx {:node node
                :tx (fn [& args]
                        (apply crux/submit-tx node args))
                :tx_sync (fn [& args]
                             (->> (apply crux/submit-tx node args)
                                  (crux.api/await-tx node)))
                :tx-commited? (fn [transaction]
                                  (and (crux/sync node)
                                       (crux/tx-committed? node transaction)))
                :sync (fn [] (crux/sync node))
                :q (fn [& args]
                       (apply q node args))
                :q_unary (fn [& args]
                             ;; A query returning unary results
                             (->> (apply q node args)
                                  (map first)))
                :q_id (fn [& args]
                           ;; A query returning only 1 result
                           (-> (apply q node args)
                               first))
                :q_id_unary (fn [& args]
                                ;; A query returning only 1 unary result
                                (-> (apply q node args)
                                    ffirst))}]

       (export-named-by-date db_ctx)

       (when (:verbose env)
             (println "Seed the database"))
       (seed db_ctx (if (not-empty (:db-seed env))
                        (:db-seed env)
                        (io/resource "swlkup/db/seed/example.edn")))
       
       db_ctx))

(defstate db_ctx
  :start (->db_ctx)
  :stop (do (export-named-by-date db_ctx)
            (.close (:node db_ctx))))
