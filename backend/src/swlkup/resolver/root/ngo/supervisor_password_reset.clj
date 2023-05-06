(ns swlkup.resolver.root.ngo.supervisor-password-reset
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.auth :as auth]
            [swlkup.model.ngo :as ngo]
            [swlkup.model.login :as login]
            [swlkup.auth.password.generate :refer [generate-password]]
            [swlkup.auth.password.hash :refer [hash-password]]))

(s/def ::supervisor t/string)

(s/fdef supervisor_password_reset
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::supervisor]) map? map?)
        :ret (s/keys :req-un [::login/mail ::login/password]))

(defn supervisor_password_reset
  [_node opt ctx _info]
  (let [{:keys [q_id_unary tx_sync, tx-committed?]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)
        supervisor (:supervisor opt)]
       (when ngo:id
         (let [login (q_id_unary '{:find [(pull ?l [*])]
                                   :where [[?l :xt/spec ::login/doc]
                                           [?l :invited-by ?ngo:id]
                                           [?l :mail ?mail]]
                                   :in [[?ngo:id ?mail]]}
                                [ngo:id supervisor])
               password (generate-password)
               password-hash (hash-password password)
               t (when login
                      (tx_sync [[:xtdb.api/put (assoc login
                                                      :password-hash password-hash)]]))]
              (when (and t (tx-committed? t))
                    {:mail (:mail login) :password password})))))

(s/def ::supervisor_password_reset (t/resolver #'supervisor_password_reset))
