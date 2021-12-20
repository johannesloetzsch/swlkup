(ns swlkup.model.languages
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::id t/string)
(s/def ::name t/string)
(s/def ::flag_url t/string)
(s/def ::idx t/int)

(s/def ::languages (s/keys :req-un [::id ::name ::flag_url ::idx]))
