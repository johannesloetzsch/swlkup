(ns swlkup.auth.password.verify-db
  (:require [swlkup.auth.password.hash :refer [verify-password]]))

(defn verify-login-against-db
  "highlevel password validation, based on our db schema"
  [ctx role mail password]
  (let [{:keys [q_id]} (:db_ctx ctx)
        [entity:id login:id password:hash]
          (q_id '{:find [<-entity:id <-login:id <-password:hash]
                  :where [[?l :crux.spec :swlkup.model.login/login]
                          [?l :swlkup.model.login/role ->role]
                          [?l :mail ->mail]
                          [?l :crux.db/id <-login:id]
                          [?l :password-hash <-password:hash]
                          [?e :swlkup.model.login/login:id <-login:id]
                          [?e :crux.db/id <-entity:id]]
                  :in [->role ->mail]}
                role mail)
        valid (verify-password password password:hash)]
       (when valid [entity:id login:id])))
