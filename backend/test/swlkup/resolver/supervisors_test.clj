(ns swlkup.resolver.supervisors-test
  (:require [clojure.test :refer [deftest is]]
            [swlkup.resolver.core :refer [graphql]]
            [mount.core :as mount]
            [swlkup.db.state]))

(mount/start)

;; Depending on the ngo the token belongs to, a limited set of supervisors is returned

(deftest token->max
  (is (= (graphql {:query "{lookup(token: \"R4nd0m\") {ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:ngo {:name "Mission Lifeline"} :supervisors [{:name_full "Max Müller"}]}}})))

(deftest token->maria+max
  (is (= (graphql {:query "{lookup(token: \"T0p53cret\") {ngo{name} supervisors{name_full}}}"})
         {:data {:lookup {:ngo {:name "Sea-Watch"} :supervisors [{:name_full "Maria Musterfrau"}{:name_full "Max Müller"}]}}})))
