(ns swlkup.model.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

;(s/def ::name (t/field t/string "Optional Description that is available in interospection"))

(s/def ::ngo (s/keys :req-un [::name]))

(s/def ::ngo:id t/id)

(t/defscalar NgoRefs
             {:name "NgoRefs" :description "Either a collection of ngo-ids or `any`"}
             (s/conformer #(cond (coll? %) (set %)
                                 (= "any" (name %)) :any
                                 :else :clojure.spec.alpha/invalid)))
