(ns swlkup.db.export
  (:require [clojure.pprint :refer [pprint]]
            [clojure.edn]))

(defn all_docs [db_ctx]
  (let [{:keys [sync q_unary]} db_ctx]
       (sync)
       (q_unary '{:find [(pull ?e [*])] :where [[?e :crux.db/id]]})))

(defn export [db_ctx file]
  (->> (all_docs db_ctx)
       ;(into [])
       (#(with-out-str (pprint %)))
       (spit file)))

(defn seed [db_ctx file]
  (let [{:keys [tx_sync]} db_ctx]
       (->> (clojure.edn/read-string (slurp file))
            (map (fn [entry] [:crux.tx/put entry]))
            tx_sync)))
