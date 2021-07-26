(ns swlkup.resolver.root.supervisor.register
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.db.state :refer [tx]]
            [swlkup.auth.password.generate :refer [generate-password]]
            [swlkup.auth.password.hash :refer [hash-password]]
            [swlkup.auth.mail.send :refer [send-mail]]
            [swlkup.model.login :as login]))

(s/def ::mail t/string)

(s/fdef supervisor_register
        :args (s/tuple map? (s/keys :req-un [::login/mail]) map? map?)
        :ret t/boolean)

(defn supervisor_register
  "Add a new supervisor account to the database and send a mail containing the password via mail"
  [_node opt _ctx _info]
  (let [mail (:mail opt)
        password (generate-password)
        password:hash (hash-password password)]
       ;; TODO do we want allow reregistration of existing users?
       ;; At the moment this simply substitudes the existing password (trivial password recovery)

       (tx[[:crux.tx/put {:crux.db/id mail
                          :crux.spec :swlkup.model.login/login
                          :mail mail
                          :password-hash password:hash}]])

       (-> (send-mail {:to mail :subject "swlkup login"
                       :body (str "username: " mail "\n"
                                  "password: " password)})
           (#(= :SUCCESS (:error %))))))

(s/def ::supervisor_register (t/resolver #'supervisor_register))
