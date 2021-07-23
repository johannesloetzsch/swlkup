(ns swlkup.resolver.branch.supervisors
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.db.state :refer [q_unary]]))

(s/fdef supervisors
        :args (s/tuple map? map? map? map?)
        :ret (s/nilable (s/* ::supervisor/supervisor)))

(defn supervisors
  "All supervisor visible with the used credentials"
  [node _opt _ctx _info]
  (let [token (get-in node [:_ :swlkup.resolver.root.lookup/lookup])
        valid (not (nil? token))]
       (when valid
             (->> (q_unary '{:find [(pull ?e [*])]
                             :in [ngo-filter token:ngo]
                             :where [[?e :crux.spec :swlkup.model.supervisor/supervisor]
                                     [?e :ngos ?ngo]
                                     [(ngo-filter ?ngo token:ngo)]]}
                           (fn [?ngo token:ngo]
                               (or (= ?ngo token:ngo)
                                   (= ?ngo :any)))
                           (:ngo token))
                  (sort-by :name_full)))))  ;; for reproducability in tests

(s/def ::supervisors (t/resolver #'supervisors))
