(ns swlkup.db.crux
  (:require [crux.api :as crux :refer [#_pull]]
            [clojure.java.io :as io]
            [config.core :refer [env]]
            [swlkup.db.seed.example :refer [example-db]]))
 
(def node (crux/start-node {} #_ {:my-rocksdb {:crux/module 'crux.rocksdb/->kv-store
                                         :db-dir (io/file (:db-dir env))
                                         :sync? true}
                            :crux/tx-log {:kv-store :my-rocksdb}
                            :crux/document-store {:kv-store :my-rocksdb}}))
(comment (.close node))

(defn tx [& args]
  (apply crux/submit-tx node args))

(defn q [& args]
  (apply crux/q (crux/db node) args))


;; TODO configurable
(defn seed []
  (tx (map (fn [entry] [:crux.tx/put entry])
           example-db)))

(comment
  (q '{:find [(pull ?e [:name])]
       :where [[?e :crux.spec :swlkup.model.ngo/ngo]]} ))


(defn q_id
  "A query that should return only 1 result"
  [& args]
  (-> (apply q args)
      first))

(defn q_id_unary
  "A query that should return only 1 unary result"
  [& args]
  (-> (apply q args)
      first first))
