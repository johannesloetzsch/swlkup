(ns swlkup.webserver.middleware
  (:require [swlkup.config.state :refer [env]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.webjars :refer [wrap-webjars]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.middleware.not-modified :refer [wrap-not-modified]]
            [ring.middleware.multipart-params :refer [wrap-multipart-params]]
            [ring.util.json-response :refer [json-response]]
            [ring.util.response :refer [resource-response content-type]]
            [lib.graphql.middleware :refer [wrap-graphql-error]]
            [lib.resources.list-resources :refer [list-resources]]
            [clojure.string :as string :refer [ends-with?]]))


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

(defn wrap-rest
  "Use the same error handling as for graphql"
  [handler]
  (-> handler
      (wrap-graphql-error)))

(defn wrap-nextjs-frontend
  "Serve the frontend:
   1. Everything from the backend that is not the mocked /
   2. Any directory should serve the index.html when existing
   3. Serve an .html file instead of a requested file without extension
   4. When a not existing file is accessed in a directory with only 1 .html (probably a route with a variable), serve that instead
   5. If all attempts failed, pass the 404"
  [handler]
  (fn [req]
      (let [res (handler req)
            path (string/replace (:uri req) #"/[^/]*$" "/")
            file (string/replace (:uri req) #".*/" "")
            html (->> (list-resources (str "public" path))
                      (remove #(re-matches #".+[/].*" %))  ;; only files that are not in a subdirectory
                      (filter #(re-matches #".*\.html" %)))]
           (cond (not (or (= 404 (:status res))
                          (= "/" (:uri req))))
                   res
                 (and (ends-with? (:uri req) "/")
                      (some #{"index.html"} html))
                   {:status 302
                    :headers {"Location" (str (:uri req) "index.html")}
                    :body ""}
                 (some #{(str file ".html")} html)
                   {:status 302
                    :headers {"Location" (str (:uri req) ".html")}
                    :body ""}
                 (= 1 (count html))
                   (-> (resource-response (str "public" path (first html)))
                       (content-type "text/html"))
                 :else
                   res))))

(defn wrap-frontend-config
  "Provide config for static build of frontend"
  [handler]
  (fn [req]
      (if (= "/config.json" (:uri req))
          (json-response {:base_url (:frontend-base-url env)
                          :backend_base_url (:frontend-backend-base-url env)})
          (handler req))))


(defn wrap-defaults [handler]
  (-> handler
      (wrap-content-type)
      (wrap-multipart-params)
      (wrap-not-modified)))
