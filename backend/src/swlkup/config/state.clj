(ns swlkup.config.state
  "Wrapping yogthos/config with defstate allows overwriting the config at runtime and checking it at startup against a spec"
  (:require [clojure.spec.alpha :as s]
            [mount.core :refer [defstate args]]
            [config.core]
            [clojure.string]))

(s/def ::verbose boolean?)

(s/def ::port number?)  ;; the webserver port

(s/def ::validate-output boolean?)  ;; should specialist ensure type correctness

(s/def ::db-inmemory boolean?)  ;; we run unit tests in an in-memory instance, otherwise the default db would be looked
(s/def ::db-dir string?)  ;; ignored when ::db-inmemory

(s/def ::env (s/keys :req-un [::verbose
                              ::port
                              ::validate-output
                              ::db-inmemory ::db-dir]))

(defn filter-defined [keys-spec m]
  (let [req-un (last (s/form keys-spec))
        unnamespaced-keys (map #(-> (clojure.string/replace %
                                                            (if-let [n (namespace %)]
                                                                    (str n "/")
                                                                    "")
                                                            "")
                                    (clojure.string/replace ":" "")
                                    keyword)
                               req-un)]
       (select-keys m (into [] unnamespaced-keys))))

(defstate env
  :start (let [env (->> (merge (config.core/load-env)
                               (args))  ;; allows: (mount/start-with-args {…})
                        (filter-defined ::env))
               config-errors (s/explain-data ::env env)]
              (when (:verbose env)
                    (println env))
              (assert (not config-errors) (with-out-str (s/explain-out config-errors)))
              env))
