(ns swlkup.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [swlkup.resolver.root.lookup :refer [lookup]]
            [swlkup.resolver.root.languages :refer [languages]]
            [swlkup.resolver.root.offers :refer [offers]]
            [swlkup.config.state :refer [env]]))

(def graphql* (executor {:query {:lookup #'lookup
                         :languages #'languages
                         :offers #'offers}}))

(defn graphql [query]
  (graphql* (assoc-in query
                      [:context :validate-output?]
                      (or (get-in query [:context :validate-output?])
                          (:validate-output env)))))
