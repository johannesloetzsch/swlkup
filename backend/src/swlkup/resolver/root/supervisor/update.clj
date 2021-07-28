(ns swlkup.resolver.root.supervisor.update
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.password.verify-db :refer [verify-login-against-db]]
            [swlkup.model.login :as login]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_update
        :args (s/tuple map? (s/keys :req-un [::login/mail ::login/password
                                             ::supervisor/supervisor_input]) map? map?)
        :ret t/boolean)

(defn supervisor_update
  "Update a supervisors data"
  [_node opt ctx _info]
  (let [{:keys [tx]} (:db_ctx ctx)
        [supervisor:id login:id] (verify-login-against-db ctx :supervisor (:mail opt) (:password opt))
        tx_result (when supervisor:id
                        (tx [[:crux.tx/put (assoc (:supervisor_input opt)
                                                   :crux.db/id supervisor:id
                                                   :crux.spec ::supervisor/supervisor
                                                   ::login/login:id login:id)]]))]
       (boolean (:crux.tx/tx-id tx_result))))

(s/def ::supervisor_update (t/resolver #'supervisor_update))
