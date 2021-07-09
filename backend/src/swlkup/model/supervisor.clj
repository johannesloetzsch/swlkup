(ns swlkup.model.supervisor
  (:require [clojure.spec.alpha :as s]))

#_(s/def ::contacts (s/keys :opt-un [::phone
                                   ::website]))

(s/def ::supervisor (s/keys :req-un [::email  ;; also used as primary key
                                     ::login  ;; password hash
                                     ::name_full
                                     ::languages
                                     ::offers
                                     #_::location
                                     #_::contacts]
                            :opt-un [::photo
                                     ::text]))
