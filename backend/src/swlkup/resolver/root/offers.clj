(ns swlkup.resolver.root.offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.offers :as offers]))

(s/fdef offers
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::offers/offers))

(defn offers
  "All offers"
  [_node _opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)]
       (q_unary '{:find [(pull ?e [*])]
                  :where [[?e :crux.spec :swlkup.model.offers/offers]]})))

(s/def ::offers (t/resolver #'offers))
