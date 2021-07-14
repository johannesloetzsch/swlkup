(ns swlkup.resolver.root.offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.offers :as offers]
            [swlkup.db :refer [db]]))

(s/fdef offers
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::offers/offers))

(defn offers
  "All offers"
  [_node _opt _ctx _info]
  (:offers db))

(s/def ::offers (t/resolver #'offers))
