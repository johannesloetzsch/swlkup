(ns swlkup.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [swlkup.resolver.root.lookup :refer [lookup]]
            [swlkup.resolver.root.languages :refer [languages]]
            [swlkup.resolver.root.offers :refer [offers]]))

(def graphql (executor {:query {:lookup #'lookup
                                :languages #'languages
                                :offers #'offers}}))
