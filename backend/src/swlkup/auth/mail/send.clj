(ns swlkup.auth.mail.send
  (:require [postal.core :refer [send-message]]
            [swlkup.config.state :refer [env]]))

(defn send-mail [msg*]
  (let [server {:host (:mail-host env)
                :user (:mail-user env)
                :pass (:mail-pass env)
                :port (:mail-port env)
                :tls true}
        msg (assoc msg* :from (or (:mail-from env)
                                  (:mail-user-from env)))]
       (send-message server msg)))