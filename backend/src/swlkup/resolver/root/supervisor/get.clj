(ns swlkup.resolver.root.supervisor.get
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.auth :as auth]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.model.ngo :as ngo]))

(s/fdef supervisor_get
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/nilable ::supervisor/supervisor))

(defn supervisor_get
  "For a supervisor login, get the supervisors data"
  [_node opt ctx _info]
  (let [{:keys [q_id_unary]} (:db_ctx ctx)
        [supervisor:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)]
       (when supervisor:id
             (assoc
               (supervisor/db->graphql
                 (q_id_unary '{:find [(pull ?e [*])]
                               :where [[?e :xt/spec :swlkup.model.supervisor/doc]
                                       [?e :xt/id ->supervisor:id]]
                               :in [->supervisor:id]}
                             supervisor:id))
               :ngo ngo:id))))

(s/def ::supervisor_get (t/resolver #'supervisor_get))
