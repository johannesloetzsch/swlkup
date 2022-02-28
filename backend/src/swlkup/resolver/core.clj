(ns swlkup.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]
            [swlkup.db.state :refer [->db_ctx db_ctx]]
            ;; public
            [swlkup.resolver.root.languages :refer [languages]]
            [swlkup.resolver.root.offers :refer [offers]]
            [swlkup.resolver.root.ngos :refer [ngos]]
            ;; with token
            [swlkup.resolver.root.user.lookup :refer [lookup]]
            ;; any login
            [swlkup.resolver.root.login :refer [login]]
            ;; supervisor login
            [swlkup.resolver.root.supervisor.get :refer [supervisor_get]]
            [swlkup.resolver.root.supervisor.update :refer [supervisor_update]]
            [swlkup.resolver.root.supervisor.delete :refer [supervisor_delete]]
            [swlkup.resolver.root.supervisor.deactivate :refer [supervisor_deactivate]]
            ;; ngo login
            [swlkup.resolver.root.ngo.register-supervisor :refer [supervisor_register]]
            [swlkup.resolver.root.ngo.registered-supervisor :refer [supervisors_registered]]
            [swlkup.resolver.root.ngo.create-token :refer [create_token]]
            [swlkup.resolver.root.ngo.created-tokens :refer [created_tokens]]
            [swlkup.resolver.root.ngo.invalidate-token :refer [invalidate_token]]
            ;; admin passphrase
            [swlkup.resolver.root.admin.export :refer [export]]))

(def graphql* (executor {:query {:lookup #'lookup
                                 :login #'login
                                 :ngos #'ngos
                                 :languages #'languages
                                 :offers #'offers
                                 :supervisor_get #'supervisor_get
                                 :supervisors_registered #'supervisors_registered
                                 :created_tokens #'created_tokens
                                 :export #'export}
                         :mutation {:supervisor_register #'supervisor_register
                                    :supervisor_update #'supervisor_update
                                    :supervisor_delete #'supervisor_delete
                                    :supervisor_deactivate #'supervisor_deactivate
                                    :create_token #'create_token
                                    :invalidate_token #'invalidate_token}}))

(defn ->graphql
  "Create a wrapped graphql-executor, that merges context into the request.

   For default usage in the app, the db_ctx should be a singleton handled by mount.
   When {:singleton? true} is used, closing the db (deleting the lock) is provided by mount.

   Since all testcases within a file run in parallel, several db instances are wanted to avoid race conditions.
   It's easy to get an executor with a new db-instance by (->graphql) for testcases with mutations.
   The easiest way of having several instances without worrying about locks is using the config option {:db-inmemory true}."

  [& {:keys [singleton?] :or {singleton? false}}]
  (let [db_ctx (if singleton? db_ctx (->db_ctx))]
       (fn [query]
           (graphql* (-> query
                         (assoc-in [:context :db_ctx]
                                   db_ctx)
                         (assoc-in [:context :validate-output?]
                                   (or (get-in query [:context :validate-output?])
                                       (:validate-output env))))))))

(defstate graphql
  :start (swlkup.resolver.core/->graphql :singleton? true))
