(ns swlkup.model.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::ngo (s/keys :req-un [::id ::name]))

(s/def ::ngo:id t/id)

(t/defscalar NgoRefs
             {:name "NgoRefs" :description "Either a collection of ngo-ids or `any`"}
             (s/conformer #(cond (coll? %) (set %)
                                 (= "any" (name %)) :any
                                 :else :clojure.spec.alpha/invalid)))

(s/def ::doc (s/keys :req-un [::name]))

(defn db->graphql [doc]
  (some-> doc
          (select-keys [:xt/id :name])
          (assoc :id (:xt/id doc))))
