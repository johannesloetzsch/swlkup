(ns swlkup.model.supervisor.location
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(t/defobject Location {:kind t/object-kind}
            :req-un [::zip
                     ::lon ::lat ::radius_kilometer]
            :opt-un [::address_string])

(s/def ::location Location)
