(ns swlkup.model.supervisor.contacts
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(t/defobject Contacts {:kind t/object-kind #_#_:description "Example object"}
            :req-un [::phone ::website])

(s/def ::contacts Contacts)
