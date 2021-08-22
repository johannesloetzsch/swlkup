(ns swlkup.db.state
  (:require[crux.api :as crux]
            [clojure.java.io :as io]
            [swlkup.db.export :refer [export seed ]]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]
            [swlkup.db.validate :refer [validate-db validate-tx]]))

(defn export-named-by-date [db_ctx]
  (when (:db-export-prefix env)
        (let [date (.format (java.text.SimpleDateFormat. "yyyy-MM-dd_HH:mm:ss")
                            (.getTime (java.util.Calendar/getInstance)))
              file (str (:db-export-prefix env) date ".edn")]
             (when (:verbose env)
                   (println "Export database to:" file))
             (export file db_ctx))))

(defn submit-tx [node tx-ops]
  (crux/submit-tx node (validate-tx tx-ops)))

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
                :tx (fn [tx-ops]
                        (submit-tx node tx-ops))
                :tx_sync (fn [tx-ops]
                             (->> (submit-tx node tx-ops)
                                  (crux.api/await-tx node)))
                :tx-committed? (fn [transaction]
                                   (println "synced" (crux/sync node))
                                   (println "awaited" (crux/await-tx node transaction))
                                   (crux/tx-committed? node transaction))
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

       (let [seed-file (if (not-empty (:db-seed env))
                           (:db-seed env)
                           (io/resource "swlkup/db/seed/example.edn"))]
            (when (:verbose env)
                  (println "Seed the database from:" seed-file))
            (seed seed-file db_ctx))
      
       (if (:db-validate env)
           (or (validate-db db_ctx)
               (System/exit 1))
           db_ctx)))

(defstate db_ctx
  :start (->db_ctx)
  :stop (do (export-named-by-date db_ctx)
            (.close (:node db_ctx))))
