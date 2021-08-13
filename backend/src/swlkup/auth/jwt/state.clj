(ns swlkup.auth.jwt.state
  (:require [crypto.random]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state]))

(def secret_length:bytes 64)  ;; recommended by https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#weak-token-secret

(defstate secret
 :start (or (:jwt-secret swlkup.config.state/env)
            (crypto.random/bytes secret_length:bytes)))
