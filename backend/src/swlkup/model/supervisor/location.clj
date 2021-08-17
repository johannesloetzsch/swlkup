(ns swlkup.model.supervisor.location
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(t/defobject Location {:kind t/object-kind}
            :req-un [::zip
                     #_#_#_::lon ::lat ::radius_kilometer]
            :opt-un [::address_string])

(s/def ::location Location)

(t/defobject LocationInput {:kind t/input-object-kind}
            :req-un [::zip]
            :opt-un [::address_string])
