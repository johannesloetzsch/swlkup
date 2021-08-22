(ns swlkup.resolver.root.ngo.registered-supervisor
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.auth :as auth]
            [swlkup.model.ngo :as ngo]
            [swlkup.model.supervisor :as supervisor]
            [swlkup.model.login :as login]))

(s/def ::name_full (s/nilable ::supervisor/name_full))

(s/fdef supervisors_registered
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/* (s/keys :req-un [::login/mail ::name_full])))

(defn supervisors_registered
  [_node opt ctx _info]
  (let [{:keys [q]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)]
       (when ngo:id
         (let [supervisors_registered (q '{:find [?mail]
                                           :where [[?l :crux.spec ::login/doc]
                                                   [?l :invited-by ?ngo:id]
                                                   [?l :mail ?mail]]
                                           :in [?ngo:id]}
                                         ngo:id)
               supervisors_active (q '{:find [?mail ?name_full]
                                       :where [[?l :crux.spec ::login/doc]
                                               [?l :invited-by ?ngo:id]
                                               [?l :mail ?mail]
                                               [?e ::login/login:ids ?l]
                                               [?e :name_full ?name_full]]
                                       :in [?ngo:id]}
                                     ngo:id)]
              (map (fn [[k v]] {:mail k :name_full v})
                   (merge (into {} (map #(conj % nil) supervisors_registered))
                          (into {} supervisors_active)))))))

(s/def ::supervisors_registered (t/resolver #'supervisors_registered))
