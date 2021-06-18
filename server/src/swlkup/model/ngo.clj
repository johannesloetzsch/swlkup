(ns swlkup.model.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

;(s/def ::name (t/field t/string "Optional Description that is available in interospection"))

(s/def ::ngo (s/keys :req-un [::name]))
