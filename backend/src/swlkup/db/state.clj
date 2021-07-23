(ns swlkup.db.state
  (:require[crux.api :as crux]
            [clojure.java.io]
            [swlkup.db.seed.example]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state]))

(defstate node
  :start (let [node (crux/start-node (when-not (:db-inmemory swlkup.config.state/env)
                                               {:my-rocksdb {:crux/module 'crux.rocksdb/->kv-store
                                                             :db-dir (clojure.java.io/file (:db-dir swlkup.config.state/env))
                                                             :sync? true}
                                                :crux/tx-log {:kv-store :my-rocksdb}
                                                :crux/document-store {:kv-store :my-rocksdb}}))]

              (println "Seed the database")
              (crux/submit-tx node (map (fn [entry] [:crux.tx/put entry])
                                        swlkup.db.seed.example/example-db))

              node)
  :stop (.close node))


(defn tx [& args]
  (apply crux/submit-tx node args))

(defn q [& args]
  (apply crux/q (crux/db node) args))


(defn q_unary
  "A query returning unary results"
  [& args]
  (->> (apply q args)
       (map first)))


(defn q_id
  "A query returning only 1 result"
  [& args]
  (-> (apply q args)
      first))

(defn q_id_unary
  "A query returning only 1 unary result"
  [& args]
  (-> (apply q args)
      first first))
