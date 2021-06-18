(ns swlkup.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.webjars :refer [wrap-webjars]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [lib.graphql.middleware :refer [wrap-graphql-error]]
            [ring.util.response :refer [response]]
            [swlkup.resolver.core :refer [graphql]]))

(defroutes app-routes
  (GET "/" [] "Try the /graphql endpoint :)")
  (POST "/graphql" req
    (-> (response (graphql (:body req)))))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      (wrap-graphql-error)

      (wrap-webjars) 
      (wrap-resource "public")

      (wrap-json-response)
      (wrap-json-body {:keywords? true :bigdecimals? true})))
