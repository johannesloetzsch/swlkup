(ns swlkup.resolver.supervisors-deactivate-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [->graphql]]))

(def mail "praxis@max.mueller.de")
(def password "i!A;z\\\"'^G3Q)w])%83)")

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))


(deftest deactivate-wrong-login
  (let [graphql (->graphql)]

       (is (= (graphql {:query "mutation x($auth: Auth) {
                                  supervisor_deactivate(auth: $auth, deactivated: true)}"
                        :variables {:auth {:mail mail :password "wrong"}}})
              {:data {:supervisor_deactivate false}}))

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors [{:name_full "Max Müller"}]}}}))))


(deftest deactivate-correct-login
  (let [graphql (->graphql)]

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors [{:name_full "Max Müller"}]}}}))

       (is (= (graphql {:query "mutation x($auth: Auth) {
                                  supervisor_deactivate(auth: $auth, deactivated: true)}"
                        :variables {:auth {:mail mail :password password}}})
              {:data {:supervisor_deactivate true}}))

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors []}}}))

       ;; There exist 2 mutations that can reactivate a profile (supervisor_update and supervisor_deactivate).
       ;; Neither is security critical.

       (is (= (graphql {:query "mutation x($auth: Auth) {
                                  supervisor_deactivate(auth: $auth, deactivated: false)}"
                        :variables {:auth {:mail mail :password password}}})
              {:data {:supervisor_deactivate true}}))

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors [{:name_full "Max Müller"}]}}}))))
