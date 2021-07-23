(ns swlkup.config.state
  "Wrapping yogthos/config with defstate allows overwriting the config at runtime and checking it at startup against a spec"
  (:require [clojure.spec.alpha :as s]
            [mount.core :refer [defstate]]
            [config.core]))

(s/def ::port number?)  ;; the webserver port
(s/def ::db-inmemory boolean?)  ;; we run unit tests in an in-memory instance, otherwise the default db would be looked
(s/def ::db-dir string?)  ;; ignored when ::db-inmemory
(s/def ::env (s/keys :req-un [::port
                              ::db-inmemory ::db-dir]))

(defstate env
  :start (let [env (config.core/load-env)
               config-errors (s/explain-data ::env env)]
              (assert (not config-errors) (with-out-str (s/explain-out config-errors)))
              env))
