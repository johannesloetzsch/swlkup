(ns swlkup.resolver.root.ngos
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.ngo :as ngo :refer [db->graphql]]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.model.auth :as auth]
            [swlkup.auth.core :refer [auth+role->entity]]))

(s/fdef ngos
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/* ::ngo/ngo))

(defn ngos
  "All Ngos"
  [_node opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)
        [_supervisor:id login:id] (auth+role->entity ctx (:auth opt) ::supervisor/supervisor)]
       (when login:id
             (map db->graphql
                  (q_unary '{:find [(pull ?e [*])]
                             :where [[?e :crux.spec :swlkup.model.ngo/ngo]]})))))

(s/def ::ngos (t/resolver #'ngos))
