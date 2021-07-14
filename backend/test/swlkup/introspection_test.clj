(ns swlkup.introspection-test
  (:require [clojure.test :refer [deftest is]]
            [swlkup.resolver.core :refer [graphql]]))

(deftest introspection
  (is (= (->> (-> (graphql {:query "{__schema{types{name}}}"})
                  (get-in [:data :__schema :types]))
              (map :name)
              sort)
         '("Boolean" "Contacts" "Float" "ID" "Int" "Location" "Long" "QueryType" "String" "languages" "lookup" "ngo" "offers" "supervisors"))))
