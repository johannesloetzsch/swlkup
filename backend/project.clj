(defproject swlkup-backend "0.2.0"
  :description "supervisor lookup backend"
  :min-lein-version "2.0.0"
  :dependencies [;; core
                 [org.clojure/clojure "1.10.3"]
                 [yogthos/config "1.1.8"]
                 [mount "0.1.16"]
                 [spootnik/signal "0.2.4"]
                 ;; db
                 [com.xtdb/xtdb-core "1.20.0"]
                 [com.xtdb/xtdb-rocksdb "1.20.0"]
                 ;; graphql + http
                 [org.clojars.johannesloetzsch/specialist-server "0.6.1"]
                 [compojure "1.6.2"]
                 [ring/ring-core "1.8.2"]
                 [ring/ring-jetty-adapter "1.8.2"]
                 [ring/ring-devel "1.9.4"]
                 [ring-cors "0.1.13"]
                 [ring/ring-json "0.5.1"]
                 [ring-json-response "0.2.0"]
                 [ring-webjars "0.2.0"]
                 [org.webjars/graphiql "0.11.11"]
                 ;; auth + mail
                 [cryptohash-clj "0.1.10"]
                 [likid_geimfari/secrets "1.0.0"]
                 [crypto-random "1.2.1"]
                 [buddy/buddy-sign "3.4.1"]
                 ;[com.draines/postal "2.0.4"]
                ]
  :main swlkup.webserver.state
  :profiles {:dev {:dependencies [;; helpers for testing
                                  [javax.servlet/servlet-api "2.5"]
                                  [ring/ring-mock "0.4.0"]
                                  ;; additional deps to run `lein test` 
                                  [nrepl/nrepl "0.8.3"]
                                  [clojure-complete/clojure-complete "0.2.5"]]
                   #_#_:jvm-opts ["-Dverbose=true"]}
             :test {:jvm-opts ["-Ddb-inmemory=true" "-Ddb-export-prefix="]}
             :uberjar {:aot :all}})
