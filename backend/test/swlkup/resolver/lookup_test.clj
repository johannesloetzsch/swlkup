(ns swlkup.resolver.lookup-test
  (:require [clojure.test :refer [deftest is]]
            [swlkup.resolver.core :refer [graphql]]))

(deftest correct-token
  (is (= (graphql {:query "{lookup(token: \"T0p53cret\") {ngo{name}}}"})
         {:data {:lookup {:ngo {:name "Sea-Watch"}}}})))

(deftest wrong-token
  (is (thrown? Error
      (graphql {:query "{lookup(token: \"wrong\") {ngo{name}}}"}))))
