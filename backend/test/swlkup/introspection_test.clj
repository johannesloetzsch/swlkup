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
         '("Boolean" "Contacts" "ContactsInput" "Float" "ID" "Int" "Location" "Long" "MutationType" "NgoRefs" "QueryType" "String" "SupervisorInput" "languages" "lookup" "ngo" "offers" "supervisor_get" "supervisors"))))
