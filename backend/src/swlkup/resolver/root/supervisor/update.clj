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
  "Update a supervisors profile

   (:supervisor_input opt) will be merged into an existing database entry when existing.
   To delete an entry, it must explicitly be in the dictionary.
   This allows editing a profile without overwriting :photo and :deactivated.
  "
  [_node opt ctx _info]
  (let [{:keys [tx-fn-put tx-fn-call sync]} (:db_ctx ctx)
        [supervisor:id login:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)
        tx_result (when login:id  ;; any login, independent of role can be used
                        (tx-fn-put :merge-supervisor-profile
                                   '(fn [ctx eid doc login:id]
                                        (let [db (xtdb.api/db ctx)
                                              entity (xtdb.api/entity db eid)]
                                             [[:xtdb.api/put (assoc (merge entity doc)
                                                                    :xt/id eid
                                                                    :xt/spec ::supervisor/doc
                                                                    ::login/login:ids login:id)]])))
                        (tx-fn-call :merge-supervisor-profile (or supervisor:id (uuid))
                                                              (:supervisor_input opt)
                                                              login:id))]
       (sync)
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::supervisor_update (t/resolver #'supervisor_update))


(defn supervisor_update_photo
  "Update a supervisors profile picture

   This mutation is not directly usable (via graphql API), but only called from the `upload-supervisor-picture` handler.
   That gives us full control over the url and avoids:
   * potential XSS via SVG
   * tracking of users by images embedded from other servers
  "
  [_node opt ctx _info]
  (let [{:keys [tx-fn-put tx-fn-call sync]} (:db_ctx ctx)
        [supervisor:id _login:id] (auth+role->entity ctx (:auth opt) ::supervisor/doc)
        tx_result (when supervisor:id
                        (tx-fn-put :update-supervisor-photo
                                   '(fn [ctx eid photo]
                                        (let [db (xtdb.api/db ctx)
                                              entity (xtdb.api/entity db eid)]
                                             [[:xtdb.api/put (assoc entity :photo photo)]])))
                        (tx-fn-call :update-supervisor-photo supervisor:id (:photo opt)))]
       (sync)
       (boolean (:xtdb.api/tx-id tx_result))))
