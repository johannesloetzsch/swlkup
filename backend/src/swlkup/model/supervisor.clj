(ns swlkup.model.supervisor
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.ngo :as ngo]
            [swlkup.model.supervisor.location :as location :refer [LocationInput]]
            [swlkup.model.supervisor.contacts :as contacts :refer [ContactsInput]]
            [swlkup.model.languages :as languages]
            [swlkup.model.offers :as offers]))

(defn assoc-missing-opt
  "specialist allows optional keys to be nil, but they must exist"
  [doc k]
  (if (contains? doc k)
      doc
      (assoc doc k nil)))

(defn db->graphql [doc]
  (-> (assoc doc :id (:crux.db/id doc))
      (assoc-missing-opt :photo)
      (assoc-missing-opt :text_specialization)
      (assoc-missing-opt :text)))

(s/def ::id t/string)
(s/def ::name_full t/string)

(s/def ::ngos ngo/NgoRefs)

(s/def ::languages (t/field (s/* ::languages/id) ""))
(s/def ::offers (t/field (s/coll-of ::offers/id) ""))

;(s/def ::offers_online t/boolean)
;(s/def ::offers_offline t/boolean)

(s/def ::supervisor (s/keys :req-un [::id
                                     ::ngos
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
(s/def :input/location LocationInput)

(t/defobject SupervisorInput {:kind t/input-object-kind
                              :description "The new Dataset of a Supervisor"}
            :req-un [::ngos
                     ::name_full
                     ::languages
                     ::offers
                     :input/contacts
                     :input/location
                     ]
            :opt-un [;::location/location
                     ::photo
                     ::text_specialization
                     ::text])

(s/def ::supervisor_input SupervisorInput)

(s/def ::doc (s/keys :req-un [::ngos
                              ::name_full
                              ::languages
                              ::offers
                              :input/contacts
                              :input/location]))
