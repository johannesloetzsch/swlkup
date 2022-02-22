(ns swlkup.resolver.root.supervisor.deactivate
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.auth :as auth]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_deactivate
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::supervisor/deactivated]) map? map?)
        :ret t/boolean)

(defn supervisor_deactivate
  "(De)activate a supervisors profile"
  [_node opt ctx _info]
  (let [{:keys [tx-fn-put tx-fn-call sync]} (:db_ctx ctx)
        [supervisor:id _login:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)

        tx_result (when supervisor:id
                        (tx-fn-put :deactivate-supervisor
                                   '(fn [ctx eid deactivated]
                                        (let [db (xtdb.api/db ctx)
                                              entity (xtdb.api/entity db eid)]
                                             [[:xtdb.api/put (assoc entity :deactivated deactivated)]])))
                        (tx-fn-call :deactivate-supervisor supervisor:id (:deactivated opt)))]
       (sync)
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::supervisor_deactivate (t/resolver #'supervisor_deactivate))
