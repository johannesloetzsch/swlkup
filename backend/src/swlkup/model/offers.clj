(ns swlkup.model.offers
  (:require [clojure.spec.alpha :as s]))

(s/def ::offers (s/keys :req-un [::id ::target ::desc]))
