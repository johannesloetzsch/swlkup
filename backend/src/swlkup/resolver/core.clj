(ns swlkup.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [swlkup.resolver.root.lookup :refer [lookup]]
            [swlkup.resolver.root.languages :refer [languages]]
            [swlkup.resolver.root.offers :refer [offers]]
            [swlkup.resolver.root.supervisor.register :refer [supervisor_register]]
            [swlkup.resolver.root.supervisor.get :refer [supervisor_get]]
            [swlkup.resolver.root.supervisor.update :refer [supervisor_update]]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]
            [swlkup.db.state :refer [->db_ctx db_ctx]]))

(def graphql* (executor {:query {:lookup #'lookup
                                 :languages #'languages
                                 :offers #'offers
                                 :supervisor_get #'supervisor_get}
                         :mutation {:supervisor_register #'supervisor_register
                                    :supervisor_update #'supervisor_update}}))

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
