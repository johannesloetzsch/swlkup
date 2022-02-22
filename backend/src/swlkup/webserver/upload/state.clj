(ns swlkup.webserver.upload.state
  "This namespace provides the rest interface for up/downloading profile pictures of supervisors"
  (:require [mount.core :as mount :refer [defstate]]
            [swlkup.config.state :refer [env]]
            [ring.util.response :refer [response file-response]]
            [clojure.java.io :as io]
            [clojure.string :as string :refer [split]]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.db.state :refer [db_ctx]]
            [swlkup.resolver.root.supervisor.update :refer [supervisor_update supervisor_update_photo]]
            [swlkup.model.supervisor :as supervisor]))

(defn -upload-supervisor-picture
  "dest is a safe path, depending only on the uuid of the supervisor"
  [req]
  (let [source (get-in req [:multipart-params "upload" :tempfile])
        ctx {:db_ctx db_ctx}
        auth {:jwt (-> (get-in req [:headers "authorization"] "")
                       (split #"Bearer ") last)}
        [supervisor:id login:id] ;; The upload destination should depend on the supervisor:id.
                                 ;; If the for this login no supervisor profile exists till now, we create it first.
                                 (let [[supervisor:id login:id] (auth+role->entity ctx auth ::supervisor/doc)]
                                      (if supervisor:id
                                          [supervisor:id login:id]
                                          (when login:id
                                                (let [opt {:auth auth
                                                           :supervisor_input supervisor/empty}]
                                                     (supervisor_update nil opt ctx nil))
                                                (auth+role->entity ctx auth ::supervisor/doc))))

        dest (str (:upload-dir env) "/" supervisor:id ".jpeg")
        public_path (str "/uploads/" supervisor:id ".jpeg")]
       (if-not supervisor:id
               {:status 403
                :body "Invalid login:id, ensure you are logged in!"}
               (if (> (.length (io/file source)) (* 1024 1024 (:upload-limit-mb env)))
                   {:status 413
                    :body (str "Upload exceeds maximum size of " (:upload-limit-mb env) "MB")}
                   (do (io/copy (io/file source) (io/file dest))
                       (let [simple_hash (hash (slurp (io/file dest)))  ;; This is not an cryptographic integrety check, but only to determine caching.
                             opt {:auth auth
                                  :photo (str public_path "?" simple_hash)}]
                            (supervisor_update_photo nil opt ctx nil))
                       (response "Upload Successful"))))))

(defn -serve-uploaded-supervisor-picture
  "file-response prevents directory-transversal and symlinks"
  [id]
  (file-response id {:root (:upload-dir env)}))


(defstate upload
  "The handler `upload-supervisor-picture` requires `(:upload-dir env)` to exist. By wrapping the upload handlers into a state, we can ensure this at startup."
  :start (do ;; TODO We should either create the dir if not existing or assert that it is already existing
             (println "Info: Please ensure the upload directory is existing")
             {:handler {:upload-supervisor-picture -upload-supervisor-picture
                        :serve-uploaded-supervisor-picture -serve-uploaded-supervisor-picture}}))
             
