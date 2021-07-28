(ns swlkup.model.supervisor.contacts
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(t/defobject Contacts {:kind t/object-kind}
            :req-un [::phone ::website ::email])

(s/def ::contacts Contacts)

(t/defobject ContactsInput {:kind t/input-object-kind}
            :req-un [::phone ::website ::email])
