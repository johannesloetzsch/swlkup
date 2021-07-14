(ns swlkup.model.supervisor
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.supervisor.location :as location]
            [swlkup.model.supervisor.contacts :as contacts]))

(s/def ::offers_online t/boolean)
(s/def ::offers_offline t/boolean)

(s/def ::supervisor (s/keys :req-un [::email  ;; also used as primary key
                                     ::login  ;; password hash
                                     ::name_full
                                     ::languages  ;; todo: type
                                     ::offers
                                     ::offers_online
                                     ::offers_offline
                                     ::contacts/contacts]
                            :opt-un [::location/location
                                     ::photo
                                     ::text]))
