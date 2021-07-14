(ns swlkup.model.languages
  (:require [clojure.spec.alpha :as s]))

(s/def ::languages (s/keys :req-un [::id ::name ::flag_url]))
