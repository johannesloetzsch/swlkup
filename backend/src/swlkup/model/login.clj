(ns swlkup.model.login
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::mail t/string)  ;; Used as login-name
(s/def ::password-hash t/string)

(s/def ::login (s/keys :req-un [::mail ::password-hash]))

(s/def ::login:id t/id)

(s/def ::password t/string)  ;; The unhashed password is not part of the login schema
