(ns swlkup.webserver.handler
  (:require [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]
            [ring.util.response :refer [response file-response]]
            [ring.middleware.cors :refer [wrap-cors]]
            [swlkup.webserver.middleware :refer [wrap-rest wrap-graphql wrap-graphiql wrap-nextjs-frontend wrap-frontend-config wrap-defaults]]
            [swlkup.resolver.core :refer [graphql]]
            [clojure.java.io :as io]
            [clojure.string :as string :refer [split]]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.db.state :refer [db_ctx]]
            [swlkup.config.state :refer [env]]))

(def frontend-url (:frontend-base-url env))

(defn upload-supervisor-picture
  "dest is a safe path, depending only on the uuid of the supervisor"
  [req]
  (let [source (get-in req [:multipart-params "upload" :tempfile])
        ctx {:db_ctx db_ctx}
        jwt (-> (get-in req [:headers "authorization"] "")
                (split #"Bearer ") last)
        [supervisor:id _login:id] (auth+role->entity ctx {:jwt jwt} ::supervisor/doc)
        dest (str (:upload-dir env) "/" supervisor:id)]
       (if-not supervisor:id
               {:status 403
                :body "Invalid supervisor:id, ensure you are logged in and there exists a profile for this login."}
               (if (> (.length (io/file source)) (* 1024 1024 (:upload-limit-mb env)))
                    {:status 413
                     :body (str "Upload exceeds maximum size of " (:upload-limit-mb env) "MB")}
                    (do (io/copy (io/file source) (io/file dest))
                        (response "Upload Successful"))))))

(defn serve-uploaded-supervisor-picture
  "file-response prevents directory-transversal and symlinks"
  [id]
  (file-response id {:root (:upload-dir env)}))


(defroutes app-routes
  (GET "/" [] (str "<p>The backend takes care of data storage and securing its access.<br/>"
                   "   It provides a <a href=\"/graphql\">Graphql-API Endpoint</a>.<br/>"
                   "   You may want explore the schema and send queries using <a href=\"/graphiql/index.html\">GraphiQL</a>."
                   "</p>"
                   "<p>This build doesn't include the frontend.<br/>"
                   "   You may want start it independently and open <a href=\"" frontend-url "\">" frontend-url "</a>.</br>"
                   "   Alternatively production builds including the frontend are available via nix."
                   "</p/>"))
  (wrap-graphql
    (POST "/graphql" req
      (response (graphql (:body req)))))
  (wrap-rest
    (POST "/api/upload-supervisor-picture" req
      (upload-supervisor-picture req)))
  (GET "/uploads/:id" [id]
    (serve-uploaded-supervisor-picture id))
  (route/not-found "Not Found"))


(def app
  (-> app-routes

      (wrap-graphiql)

      (wrap-nextjs-frontend)
      (wrap-frontend-config)

      (wrap-defaults)

      (wrap-cors :access-control-allow-origin [#"http://localhost:3000"]
                 :access-control-allow-methods [:get :put :post :delete]) ))
