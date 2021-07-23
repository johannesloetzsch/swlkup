(ns swlkup.resolver.root.lookup
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.resolver.branch.ngo :as ngo]
            [swlkup.resolver.branch.supervisors :as supervisors]
            [swlkup.db.state :refer [q_id_unary]]))

(s/def ::token (t/field t/string "The secret given to a group of users, allowing anonym access to the lookup"))
(s/def ::valid t/boolean)

(s/fdef lookup
        :args (s/tuple map? (s/keys :req-un [::token]) map? map?)
        :ret (s/keys :req-un [::valid ::ngo/ngo ::supervisors/supervisors]))

(defn lookup
  "All supervisors visible to the ngo assiged to the token"
  [_node opt _ctx _info]
  (let [token (:token opt)
        token-data (q_id_unary '{:find [(pull ?e [*])]
                                 :in [token]
                                 :where [#_[?e :crux.spec :swlkup.model.languages/languages]
                                         [?e :token token]]}
                               token)]
       {:_ {::lookup token-data}
        :_cred {::token token-data}
        :valid (not (nil? token-data))
        :ngo #'ngo/ngo
        :supervisors #'supervisors/supervisors}))

(s/def ::lookup (t/resolver #'lookup))
