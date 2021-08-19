(ns swlkup.introspection-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [graphql]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest introspection
  (is (= (->> (-> (graphql {:query "{__schema{types{name}}}"})
                  (get-in [:data :__schema :types]))
              (map :name)
              sort)
         '("Auth" "Boolean" "Contacts" "ContactsInput" "Float" "ID" "Int" "Location" "LocationInput" "Long" "MutationType" "NgoRefs" "QueryType" "String" "SupervisorInput" "created_tokens" "languages" "login" "lookup" "ngo" "ngos" "offers" "supervisor_get" "supervisors" "supervisors_registered"))))
