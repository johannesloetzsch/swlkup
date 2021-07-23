(ns swlkup.model.offers
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::id t/string)
(s/def ::target t/string)
(s/def ::desc t/string)

(s/def ::offers (s/keys :req-un [::id ::target ::desc]))
