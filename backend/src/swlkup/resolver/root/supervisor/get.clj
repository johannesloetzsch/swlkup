(ns swlkup.resolver.root.supervisor.get
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.db.state :refer [q_id_unary]]
            [swlkup.auth.password.hash :refer [verify-password]]
            [swlkup.model.login :as login]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_get
        :args (s/tuple map? (s/keys :req-un [::login/mail ::login/password]) map? map?)
        :ret (s/nilable ::supervisor/supervisor))

(defn supervisor_get
  "For a supervisor login, get the supervisors data"
  [_node opt _ctx _info]
  (let [mail (:mail opt)
        password (:password opt)
        password:hash (q_id_unary '{:find [?password-hash]
                                    :where [[?e :crux.spec :swlkup.model.login/login]
                                            [?e :mail mail]
                                            [?e :password-hash ?password-hash]]
                                    :in [mail]}
                                  mail)
        valid (verify-password password password:hash)]
       (when valid
             (supervisor/db->graphql
               (q_id_unary '{:find [(pull ?e [*])]
                             :where [[?e :crux.spec :swlkup.model.supervisor/supervisor]
                                     [?e :swlkup.model.login/login:id ?login]
                                     [?login :mail mail]]
                             :in [mail]}
                           mail)))))

(s/def ::supervisor_get (t/resolver #'supervisor_get))
