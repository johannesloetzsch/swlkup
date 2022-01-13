(ns swlkup.resolver.root.supervisor.delete
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.auth.uuid.core :refer [uuid]]
            [swlkup.model.auth :as auth]
            [swlkup.model.login :as login]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisor_delete
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret t/boolean)

(defn supervisor_delete
  "Delete a supervisors dataset and login"
  [_node opt ctx _info]
  (let [{:keys [tx_sync]} (:db_ctx ctx)
        [supervisor:id login:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)
        _ (when supervisor:id
                (tx_sync [[:xtdb.api/evict supervisor:id]]))
        tx_result (when login:id
                        (tx_sync [[:xtdb.api/evict login:id]]))]
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::supervisor_delete (t/resolver #'supervisor_delete))
