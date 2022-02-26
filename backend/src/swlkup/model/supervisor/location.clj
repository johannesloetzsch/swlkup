(ns swlkup.model.supervisor.location
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]))

(s/def ::country (s/nilable t/string))
(s/def ::city (s/nilable t/string))
(s/def ::zip (s/nilable t/string))
(s/def ::type (s/nilable t/string))
(s/def ::display_name (s/nilable t/string))

(s/def ::importance (s/nilable t/float))
(s/def ::lat (s/nilable t/float))
(s/def ::lon (s/nilable t/float))
(s/def ::diameter (s/nilable t/float))

(t/defobject Location {:kind t/object-kind}
            :opt-un [::country ::city ::zip ::type ::importance ::display_name ::lat ::lon ::diameter])

(s/def ::location Location)

(t/defobject LocationInput {:kind t/input-object-kind}
            :opt-un [::country ::city ::zip ::type ::importance ::display_name ::lat ::lon ::diameter])
