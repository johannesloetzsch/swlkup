(ns swlkup.resolver.branch.supervisors
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.supervisor :as supervisor]))

(s/fdef supervisors
        :args (s/tuple map? map? map? map?)
        :ret (s/nilable (s/* ::supervisor/supervisor)))

(defn supervisors
  "All supervisor visible with the used credentials"
  [node _opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)
        token (get-in node [:_ :swlkup.resolver.root.lookup/lookup])
        valid (not (nil? token))]
       (when valid
             (let [db-docs (q_unary '{:find [(pull ?e [*]) ?name_full]
                                      :order-by [[?name_full :asc]]  ;; For reproducability in tests
                                      :where [[?e :crux.spec :swlkup.model.supervisor/supervisor]
                                              [?e :ngos ngos]
                                              [?e :name_full ?name_full]]
                                      :in [[ngos ...]]}  ;; Collection binding
                                    #{(:ngo token) :any})]
                  (map supervisor/db->graphql db-docs) ))))

(s/def ::supervisors (t/resolver #'supervisors))
