(ns swlkup.model.auth
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.login :as login]))

(t/defobject Auth {:name "Auth" :kind t/input-object-kind}
            :req-un [::login/mail ::login/password])

(s/def ::auth Auth)
