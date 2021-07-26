(ns swlkup.resolver.supervisors-get-test
  (:require [clojure.test :refer [deftest is]]
            [swlkup.resolver.core :refer [graphql]]
            [mount.core :as mount]
            [swlkup.db.state]))

(mount/start)

(deftest wrong-login
  (is (= (graphql {:query "mutation { supervisor_get(mail: \"praxis@max.mueller.de\", password: \"wrong\"){name_full}}"})
         {:data {:supervisor_get nil}})))

(deftest correct-login
  (is (= (graphql {:query "mutation { supervisor_get(mail: \"praxis@max.mueller.de\", password: \"i!A;z\\\"'^G3Q)w])%83)\"){name_full}}"})
         {:data {:supervisor_get {:name_full "Max Müller"}}})))
