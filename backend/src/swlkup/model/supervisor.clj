(ns swlkup.model.supervisor
  (:refer-clojure :exclude [empty])
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
  (-> (assoc doc :id (:xt/id doc))
      (assoc-missing-opt :photo)
      (assoc-missing-opt :text_specialization)
      (assoc-missing-opt :text)
      (update :location #(-> %
                             (assoc-missing-opt :country)
                             (assoc-missing-opt :city)
                             (assoc-missing-opt :zip)
                             (assoc-missing-opt :type)
                             (assoc-missing-opt :importance)
                             (assoc-missing-opt :display_name)
                             (assoc-missing-opt :lat)
                             (assoc-missing-opt :lon)
                             (assoc-missing-opt :diameter)))))

(s/def ::id t/string)
(s/def ::name_full t/string)

(s/def ::ngos ngo/NgoRefs)

(s/def ::languages (t/field (s/* ::languages/id) ""))
(s/def ::offers (t/field (s/coll-of ::offers/id) ""))

(s/def ::photo (t/field (s/nilable t/string) "URL, relative to `backend-base-url`"))

(s/def ::deactivated (s/nilable t/boolean))

(s/def ::supervisor (s/keys :req-un [::id
                                     ::deactivated
                                     ::ngos
                                     ::name_full
                                     ::languages
                                     ::offers
                                     ::contacts/contacts]
                            :opt-un [::location/location
                                     ::photo
                                     ::text_specialization
                                     ::text
                                     ::deactivated]))

(s/def :input/contacts ContactsInput)
(s/def :input/location LocationInput)

(t/defobject SupervisorInput {:kind t/input-object-kind
                              :description "The new Dataset of a Supervisor"}
            :req-un [::deactivated
                     ::ngos
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

(s/def ::doc (s/or :deactivated #(:deactivated %)
                   :default     (s/keys :req-un [::ngos
                                                 ::name_full
                                                 ::languages
                                                 ::offers
                                                 :input/contacts
                                                 :input/location])))

;; TODO adjust the types to allow deactivated supervisors without dummy data
(def empty {:deactivated true
            :ngos :any
            :name_full ""
            :languages []
            :offers #{}
            :contacts {:phone "",
                       :email ""
                       :website ""}
            :location {:zip ""}})
