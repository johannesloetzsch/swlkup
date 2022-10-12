(ns swlkup.auth.password.verify-db
  (:require [swlkup.auth.password.hash :refer [verify-password]]))

(defn login->id [ctx mail password]
  (let [{:keys [q_id]} (:db_ctx ctx)
        [login:id password:hash] (q_id '{:find [<-login:id <-password:hash]
                                         :where [[?l :xt/spec :swlkup.model.login/doc]
                                                 [?l :mail ->mail]
                                                 [?l :xt/id <-login:id]
                                                 [?l :password-hash <-password:hash]]
                                         :in [->mail]}
                                       mail)
        valid (verify-password password password:hash)]
       (when (and valid
                  (string? login:id))  ;; could be wrong when evicted
             login:id)))

(defn id->roles+entities [ctx login:id]
  (let [{:keys [q]} (:db_ctx ctx)]
       (q '{:keys [role entity]
            :find [<-role <-entity:id]
            :where [[?e :swlkup.model.login/login:ids <-login:id]
                    [?e :xt/spec <-role]
                    [?e :xt/id <-entity:id]]
            :in [<-login:id]}
          login:id)))
