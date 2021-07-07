(defproject swlkup "0.1.0-SNAPSHOT"
  :description "supervisor lookup backend"
  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [ajk/specialist-server "0.6.0"]
                 [compojure "1.6.2"]
                 ;[ring "1.9.3"]
                 [ring-cors "0.1.13"]
                 [ring/ring-json "0.5.1"]
                 [ring-webjars "0.2.0"]
                 [org.webjars/graphiql "0.11.11"]]
  :plugins [[lein-ring "0.12.5"]]
  :ring {:handler swlkup.handler/app
         :port 4000}
  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring/ring-mock "0.4.0"]]}})
