(ns swlkup.resolver.branch.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [lib.misc.filter-one :refer [filter-one]]
            [swlkup.model.ngo :as ngo]
            [swlkup.db :refer [db]]))

(s/fdef ngo
        :args (s/tuple map? map? map? map?)
        :ret ::ngo/ngo)

(defn ngo
  "Details of a ngo"
  [node _opt _ctx _info]
  (->> db :ngos
       (filter-one #(= (:id %) (get-in node [:_ :swlkup.resolver.root.lookup/lookup :ngo])))))

(s/def ::ngo (t/resolver #'ngo))
