(ns swlkup.webserver.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.middleware.content-type :refer [wrap-content-type]] 
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.webjars :refer [wrap-webjars]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.cors :refer [wrap-cors]]
            [lib.graphql.middleware :refer [wrap-graphql-error]]
            [ring.util.response :refer [response resource-response content-type]]
            [swlkup.resolver.core :refer [graphql]]
            [lib.resources.list-resources :refer [list-resources]]
            [clojure.string :as string :refer [ends-with?]]))

(def frontend-url "http://localhost:3000/")

(defroutes app-routes
  (GET "/" [] (str "<p>The backend takes care of data storage and securing its access.<br/>"
                   "   It provides a <a href=\"/graphql\">Graphql-API Endpoint</a>.<br/>"
                   "   You may want explore the schema and send queries using <a href=\"/graphiql/index.html\">GraphiQL</a>."
                   "</p>"
                   "<p>This build doesn't include the frontend.<br/>"
                   "   You may want start it independently and open <a href=\"" frontend-url "\">" frontend-url "</a>.</br>"
                   "   Alternatively production builds including the frontend are available via nix."
                   "</p/>"))
  (POST "/graphql" req
    (-> (response (graphql (-> (:body req)
                               #_(assoc-in [:context :validate-output?] false))))))
  (route/not-found "Not Found"))

(defn wrap-graphiql
  "Add graphqli using org.webjars/graphiql and resources/public/graphiql/index.html"
  [handler]
  (-> handler
      (wrap-webjars)
      (wrap-resource "public")))

(defn wrap-graphql
  "Handle Content-Type and Errors of graphql-endpoint"
  [handler]
  (-> handler
      (wrap-json-body {:keywords? true :bigdecimals? true})
      (wrap-json-response)
      (wrap-graphql-error)))

(defn wrap-nextjs-frontend
  "Serve the frontend:
   1. Everything from the backend that is not the mocked /
   2. Any directory should serve the index.html when existing
   3. When a not existing file is accessed in a directory with only 1 html (probably a route with a variable), serve that instead
   4. If all attempts failed, pass the 404"
  [handler]
  (fn [req]

      (let [res (handler req)
            path (string/replace (:uri req) #"/[^/]*$" "/")
            html (->> (list-resources (str "public" path))
                     (filter #(re-matches #".*\.html" %)))]
           (cond (not (or (= 404 (:status res))
                          (= "/" (:uri req))))
                   res
                 (and (ends-with? (:uri req) "/")
                      (some #{"index.html"} html))
                   {:status 302
                    :headers {"Location" (str (:uri req) "index.html")}
                    :body ""}
                 (= 1 (count html))
                   (-> (resource-response (str "public" path (first html)))
                       (content-type "text/html"))
                 :else
                   res))))

(defn wrap-defaults [handler]
  (-> handler
      (wrap-content-type)
      (wrap-not-modified)))

(def app
  (-> app-routes
      (wrap-graphql)
      (wrap-graphiql)

      (wrap-nextjs-frontend)

      (wrap-defaults)

      (wrap-cors :access-control-allow-origin [#"http://localhost:3000"]
                 :access-control-allow-methods [:get :put :post :delete]) ))
