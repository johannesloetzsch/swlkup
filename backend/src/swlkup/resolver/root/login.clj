(ns swlkup.resolver.root.login
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.auth :as auth]
            [swlkup.auth.jwt.login]))

(s/fdef login
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/keys :opt-un [:auth/jwt]))

(defn login
  "For a username+password get a jwt containing the login:id"
  [_node opt ctx _info]
  (let [auth (:auth opt)]
       {:jwt (swlkup.auth.jwt.login/login ctx (:mail auth) (:password auth))}))

(s/def ::login (t/resolver #'login))
