(ns swlkup.resolver.root.ngo.register-supervisor
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [crux.api :refer [sync tx-committed?]]
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
  (let [{:keys [node tx]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/ngo)]
       (boolean (when ngo:id
         (let [mail (:mail opt)
               password (generate-password)
               password:hash (hash-password password)
               t (tx [[:crux.tx/match (login_id mail) nil]
                      [:crux.tx/put {:crux.db/id (login_id mail)
                                     :crux.spec :swlkup.model.login/login
                                     :mail mail
                                     :password-hash password:hash
                                     :invited-by ngo:id}]])]
              (when (and (sync node)
                         (tx-committed? node t))
                    (send-mail {:to mail :subject "swlkup login"
                                :body (str "username: " mail "\n"
                                           "password: " password)})))))))

(s/def ::supervisor_register (t/resolver #'supervisor_register))
