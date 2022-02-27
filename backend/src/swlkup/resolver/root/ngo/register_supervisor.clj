(ns swlkup.resolver.root.ngo.register-supervisor
  (:require [swlkup.config.state :refer [env]]
            [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.auth.password.generate :refer [generate-password]]
            [swlkup.auth.password.hash :refer [hash-password]]
            [swlkup.auth.mail.send :refer [send-mail]]
            [swlkup.model.auth :as auth]
            [swlkup.model.login :as login]
            [swlkup.model.ngo :as ngo]))

(defn login_id
  "We want derive the id from the mail-address, so the transaction can ensure there isn't an already existing account for this mail-address.
   At the same time we need prevent arbitrary documents to be overwritten by choosing id via the mail-address directly."
  [mail]
  (str "login_" mail))

(s/fdef supervisor_register
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::login/mail]) map? map?)
        :ret t/boolean)

(defn supervisor_register
  "Add a new supervisor account to the database and send a mail containing the password via mail"
  [_node opt ctx _info]
  (let [{:keys [tx_sync tx-committed?]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)]
       (boolean (when ngo:id
         (let [mail (:mail opt)
               password (generate-password)
               password:hash (hash-password password)
               t (tx_sync [[:xtdb.api/match (login_id mail) nil]
                           [:xtdb.api/put {:xt/id (login_id mail)
                                           :xt/spec :swlkup.model.login/doc
                                           :mail mail
                                           :password-hash password:hash
                                           :invited-by ngo:id}]])]
              (when (tx-committed? t)
                    (println "committed")
                    (send-mail {:to mail :subject (str (:frontend-base-url env) " login")
                                :body (str "You have been invited by the SAR Support Network.\n"
                                           "We would be glad, if you participate by setting up your profile at\n"
                                           (:frontend-base-url env) "/supervisor/edit\n"
                                           "You can login using this credentials:\n"
                                           "\n"
                                           "Username: " mail "\n"
                                           "Password: " password)})))))))

(s/def ::supervisor_register (t/resolver #'supervisor_register))
