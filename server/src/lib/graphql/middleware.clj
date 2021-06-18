(ns lib.graphql.middleware
  (:require [ring.util.response :refer [response status]]
            [clojure.stacktrace :refer [print-stack-trace]]))

(defn wrap-graphql-error
 "An alternative to ring.middleware.stacktrace/wrap-stacktrace, but more compliant with graphql.
  The response is a json datastructure with an `errors` key."

  [handler]
  (fn [request]
    (try
      (handler request)
      (catch Throwable e
        (-> (response {:errors [{:message (ex-message e)
                                 :trace (with-out-str (print-stack-trace e))}]})
            (status 500))))))
