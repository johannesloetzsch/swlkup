(ns swlkup.resolver.root.supervisor.get
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.auth :as auth]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_get
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable ::supervisor/supervisor))

(defn supervisor_get
  "For a supervisor login, get the supervisors data"
  [_node opt ctx _info]
  (let [{:keys [q_id_unary]} (:db_ctx ctx)
        [supervisor:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)]
       (when supervisor:id
             (supervisor/db->graphql
               (q_id_unary '{:find [(pull ?e [*])]
                             :where [[?e :xt/spec :swlkup.model.supervisor/doc]
                                     [?e :xt/id ->supervisor:id]]
                             :in [->supervisor:id]}
                           supervisor:id)))))

(s/def ::supervisor_get (t/resolver #'supervisor_get))
