(ns swlkup.resolver.supervisors-update-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [->graphql graphql]]))

(def mail "praxis@max.mueller.de")
(def password "i!A;z\\\"'^G3Q)w])%83)")
(def supervisor_updated {:name_full "Max M. Müller"
                         :languages ["de"]
                         :ngos "any" #_["lifeline", "seawatch"]
                         :offers ["counseling", "moderation"]
                         :contacts {:phone "0123456789"
                                    :email "contact@max.mueller.de"
                                    :website "https://praxis.mueller.de"}})
(def name_original "Max Müller")
(def name_updated (:name_full supervisor_updated))

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest get-wrong-login
  (is (= (graphql {:query (str "query { supervisor_get(mail: \"" mail "\", password: \"wrong\"){name_full}}")})
         {:data {:supervisor_get nil}})))

(deftest get-correct-login
  (is (= (graphql {:query (str "query { supervisor_get(mail: \"" mail "\", password: \"" password "\"){name_full}}")})
         {:data {:supervisor_get {:name_full name_original}}})))

(deftest update-wrong-login
  (let [graphql (->graphql)]
       (is (= (graphql {:query (str "mutation x($supervisor: SupervisorInput) { 
                                       supervisor_update(mail: \"" mail "\", password: \"wrong\", supervisor_input: $supervisor)}")
                        :variables {:supervisor supervisor_updated}})
              {:data {:supervisor_update false}}))
       (is (= (graphql {:query (str "query { supervisor_get(mail: \"" mail "\", password: \"" password "\"){name_full}}")})
              {:data {:supervisor_get {:name_full name_original}}}))))

(deftest update-correct-login
  (let [graphql (->graphql)]
       (is (= (graphql {:query (str "mutation x($supervisor: SupervisorInput) { 
                                       supervisor_update(mail: \"" mail "\", password: \"" password "\", supervisor_input: $supervisor)}")
                        :variables {:supervisor supervisor_updated}})
              {:data {:supervisor_update true}}))
       (is (= (graphql {:query (str "query { supervisor_get(mail: \"" mail "\", password: \"" password "\"){name_full}}")})
              {:data {:supervisor_get {:name_full name_updated}}}))))
