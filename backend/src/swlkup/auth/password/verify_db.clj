(ns swlkup.auth.password.verify-db
  (:require [swlkup.auth.password.hash :refer [verify-password]]))

(defn login->id [ctx mail password]
  (let [{:keys [q_id]} (:db_ctx ctx)
        [login:id password:hash] (q_id '{:find [<-login:id <-password:hash]
                                         :where [[?l :crux.spec :swlkup.model.login/login]
                                                 [?l :mail ->mail]
                                                 [?l :crux.db/id <-login:id]
                                                 [?l :password-hash <-password:hash]]
                                         :in [->mail]}
                                       mail)
        valid (verify-password password password:hash)]
       (when valid login:id)))

(defn id->roles+entities [ctx login:id]
  (let [{:keys [q]} (:db_ctx ctx)]
       (q '{:keys [role entity]
            :find [<-role <-entity:id]
            :where [[?e :swlkup.model.login/login:id <-login:id]
                    [?e :crux.spec <-role]
                    [?e :crux.db/id <-entity:id]]
            :in [<-login:id]}
          login:id)))
