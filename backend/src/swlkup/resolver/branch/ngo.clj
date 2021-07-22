(ns swlkup.resolver.branch.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.ngo :as ngo]
            [swlkup.db.state :refer [q_id_unary]]))

(s/fdef ngo
        :args (s/tuple map? map? map? map?)
        :ret ::ngo/ngo)

(defn ngo
  "Details of a ngo"
  [node _opt _ctx _info]
  (q_id_unary '{:find [(pull ?e [:name])]
                :in [ngo]
                :where [;[?e :crux.spec :swlkup.model.ngo/ngo]
                       [?e :crux.db/id ngo]]}
              (get-in node [:_ :swlkup.resolver.root.lookup/lookup :ngo])))

(s/def ::ngo (t/resolver #'ngo))
