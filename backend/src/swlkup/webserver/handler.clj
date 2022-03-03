(ns swlkup.webserver.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.util.response :refer [response]]
            [ring.middleware.cors :refer [wrap-cors]]
            [ring.middleware.multipart-params :refer [wrap-multipart-params]]
            [swlkup.webserver.middleware :refer [wrap-rest wrap-graphql wrap-graphiql wrap-nextjs-frontend wrap-frontend-config wrap-defaults]]
            [swlkup.resolver.core :refer [graphql]]
            [swlkup.config.state :refer [env]]
            [swlkup.webserver.upload.state :refer [upload]]))

(def frontend-url (:frontend-base-url env))


(defroutes app-routes
  (GET "/" [] ;; When using a fullstack-build, this route is overwritten by `wrap-nextjs-frontend`
              (str "<p>The backend takes care of data storage and securing its access.<br/>"
                   "   It provides a <a href=\"/graphql\">Graphql-API Endpoint</a>.<br/>"
                   "   You may want explore the schema and send queries using <a href=\"/graphiql/index.html\">GraphiQL</a>."
                   "</p>"
                   "<p>This build doesn't include the frontend.<br/>"
                   "   You may want start it independently and open <a href=\"" frontend-url "\">" frontend-url "</a>.</br>"
                   "   Alternatively production builds including the frontend are available via nix."
                   "</p/>"))

  (->
    (POST "/graphql" req
          (response (graphql (:body req))))
    wrap-graphql
    wrap-graphiql)

  (wrap-rest
    (wrap-multipart-params
      (POST "/api/upload-supervisor-picture" req
            ((get-in upload [:handler :upload-supervisor-picture]) req))))
  (GET "/uploads/:id" [id]
       ((get-in upload [:handler :serve-uploaded-supervisor-picture]) id))

  (route/not-found "Not Found"))


(def app
  (-> app-routes

      (wrap-nextjs-frontend)
      (wrap-frontend-config)

      (wrap-defaults)

      (wrap-cors :access-control-allow-origin [#"http://localhost:3000"]
                 :access-control-allow-methods [:get :put :post :delete])))
