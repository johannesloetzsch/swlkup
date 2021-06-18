(ns swlkup.resolver.core
  (:require [specialist-server.core :refer [executor]]
            [swlkup.resolver.root.lookup :refer [lookup]]))

(def graphql (executor {:query {:lookup #'lookup}}))
