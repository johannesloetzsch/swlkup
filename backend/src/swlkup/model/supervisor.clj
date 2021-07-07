(ns swlkup.model.supervisor
  (:require [clojure.spec.alpha :as s]))

(s/def ::supervisor (s/keys :req-un [::name_full ::email ::text ::lat ::lon]))
