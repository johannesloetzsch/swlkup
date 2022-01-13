(ns swlkup.resolver.root.supervisor.update
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.auth.uuid.core :refer [uuid]]
            [swlkup.model.auth :as auth]
            [swlkup.model.login :as login]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_update
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::supervisor/supervisor_input]) map? map?)
        :ret t/boolean)

(defn supervisor_update
  "Update a supervisors data"
  [_node opt ctx _info]
  (let [{:keys [tx_sync]} (:db_ctx ctx)
        [supervisor:id login:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)
        tx_result (when login:id  ;; any login, independent of role can be used
                        (tx_sync [[:xtdb.api/put (assoc (:supervisor_input opt)
                                                         :xt/id (or supervisor:id (uuid))
                                                         :xt/spec ::supervisor/doc
                                                         ::login/login:ids login:id)]]))]
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::supervisor_update (t/resolver #'supervisor_update))
