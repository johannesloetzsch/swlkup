(ns swlkup.model.token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::token (t/field t/string "The secret given to a group of users, allowing anonym access to the lookup"))
(s/def ::purpose (s/nilable t/string))

(s/def ::token_struct (s/keys :req-un [::token ::purpose]))
