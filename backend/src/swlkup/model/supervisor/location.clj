(ns swlkup.model.supervisor.location
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(t/defobject Location {:kind t/object-kind #_#_:description "Example object"}
            :req-un [::zip
                     ::lon ::lat ::radius_kilometer]
            :opt-un [::address_string])

(s/def ::location Location)
