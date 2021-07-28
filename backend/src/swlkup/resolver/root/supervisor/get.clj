(ns swlkup.resolver.root.supervisor.get
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.password.verify-db :refer [verify-login-against-db]]
            [swlkup.model.login :as login]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_get
        :args (s/tuple map? (s/keys :req-un [::login/mail ::login/password]) map? map?)
        :ret (s/nilable ::supervisor/supervisor))

(defn supervisor_get
  "For a supervisor login, get the supervisors data"
  [_node opt ctx _info]
  (let [{:keys [q_id_unary]} (:db_ctx ctx)
        [supervisor:id] (verify-login-against-db ctx :supervisor (:mail opt) (:password opt))]
       (when supervisor:id
             (supervisor/db->graphql
               (q_id_unary '{:find [(pull ?e [*])]
                             :where [[?e :crux.spec :swlkup.model.supervisor/supervisor]
                                     [?e :crux.db/id ->supervisor:id]]
                             :in [->supervisor:id]}
                           supervisor:id)))))

(s/def ::supervisor_get (t/resolver #'supervisor_get))
