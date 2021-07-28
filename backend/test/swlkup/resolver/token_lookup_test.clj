(ns swlkup.resolver.token-lookup-test
  "Depending on the ngo the token belongs to, a limited set of supervisors is returned"
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [graphql]]))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest wrong-token
  (is (= (graphql {:query "{lookup(token: \"wrong\") {valid ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:valid false :ngo nil :supervisors nil}}})))

(deftest token->max
  (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:ngo {:name "Mission Lifeline"} :supervisors [{:name_full "Max Müller"}]}}})))

(deftest token->maria+max
  (is (= (graphql {:query "{lookup(token: \"T0p53cret\") {ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:ngo {:name "Sea-Watch"} :supervisors [{:name_full "Maria Musterfrau"}{:name_full "Max Müller"}]}}})))
