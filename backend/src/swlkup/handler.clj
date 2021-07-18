(ns swlkup.handler
  (:gen-class)
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.middleware.reload :refer [wrap-reload]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.webjars :refer [wrap-webjars]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.cors :refer [wrap-cors]]
            [lib.graphql.middleware :refer [wrap-graphql-error]]
            [ring.util.response :refer [response]]
            [swlkup.resolver.core :refer [graphql]]))

(defroutes app-routes
  (GET "/" [] "Try the /graphql endpoint :)")
  (POST "/graphql" req
    (-> (response (graphql (-> (:body req)
                               #_(assoc-in [:context :validate-output?] false))))))
  (route/not-found "Not Found"))

(def app
  (-> app-routes
      (wrap-graphql-error)

      (wrap-webjars) 
      (wrap-resource "public")

      (wrap-json-response)
      (wrap-json-body {:keywords? true :bigdecimals? true})
      
      (wrap-cors :access-control-allow-origin [#"http://localhost:3000"]
                 :access-control-allow-methods [:get :put :post :delete])
      
      (wrap-reload #'app)))

(defn -main [& _args]
  (println "Start server at http://localhost:4000")
  (run-jetty app {:port 4000}))
