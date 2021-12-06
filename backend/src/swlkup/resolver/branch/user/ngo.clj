(ns swlkup.resolver.branch.user.ngo
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.ngo :as ngo :refer [db->graphql]]))

(s/fdef ngo
        :args (s/tuple map? map? map? map?)
        :ret (s/nilable ::ngo/ngo))

(defn ngo
  "Details of a ngo"
  [node _opt ctx _info]
  (let [{:keys [q_id_unary]} (:db_ctx ctx)]
       (db->graphql
         (q_id_unary '{:find [(pull ?e [*])]
                       :in [ngo]
                       :where [[?e :xt/id ngo]
                               [?e :xt/spec :swlkup.model.ngo/doc]]}
                     (get-in node [:_ :swlkup.resolver.root.user.lookup/lookup :ngo])))))

(s/def ::ngo (t/resolver #'ngo))
