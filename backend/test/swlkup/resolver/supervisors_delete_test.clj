(ns swlkup.resolver.supervisors-delete-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [->graphql graphql]]))

(def mail "praxis@max.mueller.de")
(def password "i!A;z\\\"'^G3Q)w])%83)")
(def supervisor_updated {:deactivated false
                         :name_full "Max M. Müller"
                         :languages ["de"]
                         :ngos "any" #_["lifeline", "seawatch"]
                         :offers ["counseling", "moderation"]
                         :contacts {:phone "0123456789"
                                    :email "contact@max.mueller.de"
                                    :website "https://praxis.mueller.de"}
                         :location {:zip "01099"}})

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))


(deftest delete-wrong-login
  (let [graphql (->graphql)]

       (is (= (graphql {:query "mutation x($auth: Auth) {
                                  supervisor_delete(auth: $auth, supervisor_input: $supervisor)}"
                        :variables {:auth {:mail mail :password "wrong"}}})
              {:data {:supervisor_delete false}}))

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors [{:name_full "Max Müller"}]}}}))))


(deftest delete-correct-login
  (let [graphql (->graphql)]

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors [{:name_full "Max Müller"}]}}}))

       (is (= (graphql {:query "mutation x($auth: Auth) {
                                  supervisor_delete(auth: $auth, supervisor_input: $supervisor)}"
                        :variables {:auth {:mail mail :password password}}})
              {:data {:supervisor_delete true}}))

       (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {supervisors{name_full}}}"})
              {:data {:lookup {:supervisors []}}}))

       (is (= (graphql {:query "mutation x($auth: Auth, $supervisor: SupervisorInput) {
                                  supervisor_update(auth: $auth, supervisor_input: $supervisor)}"
                        :variables {:supervisor supervisor_updated
                                    :auth {:mail mail :password password}}})
              {:data {:supervisor_update false}}))))
