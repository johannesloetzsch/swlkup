(ns swlkup.resolver.supervisor-password-reset-test
  (:require [clojure.test :refer [use-fixtures deftest is]]
            [mount.core :as mount]
            [swlkup.resolver.core :refer [graphql]]
            [swlkup.auth.jwt.login :refer [jwt->id]]))

(def ngo_mail "crewing@example-ngo.com")
(def ngo_password "Vr(+cFtUG=rsj2:/]*uR")

(def supervisor_mail "praxis@max.mueller.de")
(def supervisor_password "i!A;z\\\"'^G3Q)w])%83)")

(use-fixtures :once (fn [testcases] (mount/stop) (mount/start) (testcases) (mount/stop)))

(deftest original-login
  (let [response (graphql {:query "query x($auth: Auth) { login(auth: $auth){ jwt } }"
                           :variables {:auth {:mail supervisor_mail :password supervisor_password}}})
        jwt (get-in response [:data :login :jwt])]
       (is (string? jwt))
       (is (= "login_max_mueller" (jwt->id jwt)))))

(deftest change-passwort-than-login
  (let [password_change_response (graphql {:query "mutation x($auth: Auth!, $supervisor: SupervisorMail!) {
                                                     supervisor_password_reset(auth: $auth, supervisor: $supervisor){mail, password} }"
                                           :variables {:auth {:mail ngo_mail :password ngo_password}
                                                       :supervisor supervisor_mail}})
        supervisor_password_new (get-in password_change_response [:data :supervisor_password_reset :password])

        login_new_response (graphql {:query "query x($auth: Auth) { login(auth: $auth){ jwt } }"
                                     :variables {:auth {:mail supervisor_mail :password supervisor_password_new}}})

        login_original_response (graphql {:query "query x($auth: Auth) { login(auth: $auth){ jwt } }"
                                          :variables {:auth {:mail supervisor_mail :password supervisor_password}}})]

       (is (= "login_max_mueller" (jwt->id (get-in login_new_response [:data :login :jwt]))))
       (is (nil? (get-in login_original_response [:data :login :jwt])))))
