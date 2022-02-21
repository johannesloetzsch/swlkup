(ns swlkup.webserver.state
  (:gen-class)  ;; this Class contains our -main function
  (:require [ring.adapter.jetty]
            [ring.middleware.reload]
            [swlkup.webserver.handler]
            [mount.core :as mount :refer [defstate]]
            [swlkup.config.state]
            [signal.handler :refer [with-handler]]))

(defstate ^{:on-reload :noop}  ;; When the app is recompiled, mount should not care, but we use ring.middleware.reload/wrap-reload
  webserver
  :start (do (println (str "Start server at http://localhost:" (:port swlkup.config.state/env)))
             (ring.adapter.jetty/run-jetty (ring.middleware.reload/wrap-reload #'swlkup.webserver.handler/app)
                                           {:port (:port swlkup.config.state/env) :join? false}))
  :stop (.stop webserver))

(defn -main [& _args]
  (mount/start)

  (with-handler :term
    (mount/stop)  ;; Export the database
    (System/exit 0))
  
  (mount.core/running-states))
