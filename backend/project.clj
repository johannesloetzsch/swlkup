(defproject swlkup-backend "0.2.3"
  :description "supervisor lookup backend"
  :min-lein-version "2.0.0"
  :dependencies [;; core
                 [org.clojure/clojure "1.10.3"]
                 [yogthos/config "1.1.9" :exclusions [org.clojure/tools.logging]]
                 [mount "0.1.16"]
                 [spootnik/signal "0.2.4"]
                 ;; db
                 [com.xtdb/xtdb-core "1.20.0" :exclusions [org.clojure/tools.logging]]
                 [com.xtdb/xtdb-rocksdb "1.20.0"]
                 ;; graphql + http
                 [org.clojars.johannesloetzsch/specialist-server "0.7.0"]
                 [compojure "1.6.2"]
                 [ring/ring-core "1.9.4"]
                 [ring/ring-jetty-adapter "1.9.4"]
                 [ring/ring-devel "1.9.4"]
                 [ring-cors "0.1.13"]
                 [ring/ring-json "0.5.1"]
                 [ring-json-response "0.2.0"]
                 [ring-webjars "0.2.0"]
                 ;; graphiql
                 [org.webjars/graphiql "0.11.11"]
                 [org.webjars.npm/react "17.0.2" :exclusions [org.webjars.npm/loose-envify org.webjars.npm/js-tokens org.webjars.npm/object-assign]]
                 [org.webjars.npm/react-dom "17.0.2" :exclusions [org.webjars.npm/loose-envify org.webjars.npm/js-tokens org.webjars.npm/object-assign org.webjars.npm/scheduler]]
                 ;; auth + mail
                 [cryptohash-clj "0.1.10"]
                 [likid_geimfari/secrets "1.1.0"]
                 [crypto-random "1.2.1"]
                 [buddy/buddy-sign "3.4.1"]
                 ;[com.draines/postal "2.0.4"]
                ]
  :main swlkup.webserver.state
  :profiles {:dev {:dependencies [;; helpers for testing
                                  [javax.servlet/servlet-api "2.5"]
                                  [ring/ring-mock "0.4.0"]
                                  ;; additional deps to run `lein test` 
                                  [nrepl/nrepl "0.9.0"]
                                  [clojure-complete/clojure-complete "0.2.5"]]
                   #_#_:jvm-opts ["-Dverbose=true"]}
             :test {:jvm-opts ["-Ddb-inmemory=true" "-Ddb-export-prefix="]}
             :uberjar {:aot :all}}
  :jvm-opts ["-Dlog4j2.formatMsgNoLookups=true"])  ;; not required, since log4j is no runtime dependency, but for defense-in-depth
