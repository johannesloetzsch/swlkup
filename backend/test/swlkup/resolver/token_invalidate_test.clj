(ns swlkup.resolver.token-invalidate-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [graphql]]))

(def mail "crewing@example-ngo.com")
(def password "Vr(+cFtUG=rsj2:/]*uR")
(def token "InvalidateTest")

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest invalidation

  (is (= (graphql {:query (str "{lookup(token: \"" token "\") {ngo{name}}}")})
         {:data {:lookup {:ngo {:name "Example NGO"}}}}))

  (is (= (graphql {:query "mutation Invalidate($auth: Auth!, $token:String!) { invalidate_token(auth: $auth, token: $token) }"
                   :variables {:auth {:mail mail :password password}
                               :token token}})
         {:data {:invalidate_token true}}))

  (is (= (graphql {:query (str "{lookup(token: \"" token "\") {ngo{name}}}")})
         {:data {:lookup {:ngo nil}}})))
