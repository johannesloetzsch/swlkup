(ns swlkup.model.supervisor
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.supervisor.location :as location]
            [swlkup.model.supervisor.contacts :as contacts :refer [ContactsInput]]
            [swlkup.model.languages :as languages]
            [swlkup.model.offers :as offers]))

(defn db->graphql [doc]
  (assoc doc :id (:crux.db/id doc)))

(s/def ::id t/string)

(s/def ::languages (t/field (s/* ::languages/id) ""))
(s/def ::offers (t/field (s/coll-of ::offers/id) ""))

;(s/def ::offers_online t/boolean)
;(s/def ::offers_offline t/boolean)

(s/def ::supervisor (s/keys :req-un [::id
                                     ::name_full
                                     ::languages
                                     ::offers
                                     ;::offers_online
                                     ;::offers_offline
                                     ::contacts/contacts]
                            :opt-un [::location/location
                                     ::photo
                                     ::text_specialization
                                     ::text]))

(s/def :input/contacts ContactsInput)

(t/defobject SupervisorInput {:kind t/input-object-kind
                              :description "The new Dataset of a Supervisor"}
            :req-un [::name_full
                     ::languages
                     ::offers
                     :input/contacts
                     ]
            :opt-un [;::location/location
                     ::photo
                     ::text_specialization
                     ::text])

(s/def ::supervisor_input SupervisorInput)
