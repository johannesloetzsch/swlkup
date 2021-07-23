(ns swlkup.resolver.lookup-test
  (:require [clojure.test :refer [deftest is]]
            [swlkup.resolver.core :refer [graphql]]
            [mount.core :as mount]
            [swlkup.db.state]))

(mount/start)

(deftest correct-token
  (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {valid ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:valid true
                          :ngo {:name "Mission Lifeline"}
                          :supervisors [{:name_full "Max Müller"}]}}})))

(deftest wrong-token
  (is (= (graphql {:query "{lookup(token: \"wrong\") {valid ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:valid false :ngo nil :supervisors nil}}})))
