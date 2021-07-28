(ns swlkup.db.state
  (:require[crux.api :as crux]
            [clojure.java.io]
            [swlkup.db.seed.example]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]))

(defn q [node & args]
        (apply crux/q (crux/db node) args))

(defn ->db_ctx []
  (let [node (crux/start-node (when-not (:db-inmemory env)
                                        {:my-rocksdb {:crux/module 'crux.rocksdb/->kv-store
                                                      :db-dir (clojure.java.io/file (:db-dir env))
                                                      :sync? true}
                                         :crux/tx-log {:kv-store :my-rocksdb}
                                         :crux/document-store {:kv-store :my-rocksdb}}))]

       (when (:verbose env)
             (println "Seed the database"))
       (->> (crux/submit-tx node (map (fn [entry] [:crux.tx/put entry])
                                      swlkup.db.seed.example/example-db))
            (crux.api/await-tx node))

       {:node node
        :tx (fn [& args]
                (->> (apply crux/submit-tx node args)
                     #_(crux.api/await-tx node)))
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
                        ffirst))
       }))

(defstate db_ctx
  :start (->db_ctx)
  :stop (.close (:node db_ctx)))
