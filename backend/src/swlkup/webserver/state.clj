(ns swlkup.webserver.state
  (:gen-class)
  (:require [ring.adapter.jetty]
            [ring.middleware.reload]
            [swlkup.webserver.handler]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state]
            [swlkup.db.state]))

(defstate webserver
  :start (do (println (str "Start server at http://localhost:" (:port swlkup.config.state/env)))
             (ring.adapter.jetty/run-jetty (ring.middleware.reload/wrap-reload #'swlkup.webserver.handler/app)
                                           {:port (:port swlkup.config.state/env) :join? false})))

(defn -main [& _args]
  (mount/start))
