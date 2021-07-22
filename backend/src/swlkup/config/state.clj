(ns swlkup.config.state
  "Wrapping yogthos/config with defstate allows overwriting the config at runtime and checking it at startup against a spec"
  (:require [clojure.spec.alpha :as s]
            [mount.core :refer [defstate]]
            [config.core]))

(s/def ::port number?)
(s/def ::db-dir string?)
(s/def ::env (s/keys :req-un [::port ::db-dir]))

(defstate env
  :start (let [env config.core/env
               config-errors (s/explain-data ::env env)]
              (assert (not config-errors) (with-out-str (s/explain-out config-errors)))
              (when-not config-errors env)))
