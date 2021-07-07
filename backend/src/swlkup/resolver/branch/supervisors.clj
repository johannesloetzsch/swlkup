(ns swlkup.resolver.branch.supervisors
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.db :refer [db]]))

(s/fdef supervisors
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::supervisor/supervisor))

(defn filter_supervisors_by_ngo
  [ngo supervisors]
  (filter (fn [supervisor]
              (let [ngo-filter (if-let [ngo-whitelist (:ngos supervisor)]
                                       (into #{} ngo-whitelist)
                                       any?)]
                   (ngo-filter ngo))) 
          supervisors))

(defn supervisors
  "All supervisor visible with the used credentials"
  [node _opt _ctx _info]
  (let [ngo (get-in node [:_ :swlkup.resolver.root.lookup/lookup :ngo])]
       (->> db :supervisors
            (filter_supervisors_by_ngo ngo))))

(s/def ::supervisors (t/resolver #'supervisors))
