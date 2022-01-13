(ns swlkup.resolver.root.ngo.invalidate-token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.token :as token]
            [swlkup.model.auth :as auth]
            [swlkup.model.ngo :as ngo]
            [xtdb.api :as xt]))

(s/fdef invalidate_token
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::token/token]) map? map?)
        :ret t/boolean)

(defn invalidate_token
  [_node opt ctx _info]
  (let [{:keys [q_id_unary tx-fn-put tx-fn-call sync]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)
        token:id (q_id_unary '{:find [?id]
                               :where [[?t :xt/spec :swlkup.model.token/doc]
                                       [?t :ngo ->ngo:id]
                                       [?t :token ->token]
                                       [?t :xt/id ?id]]
                               :in [[->ngo:id ->token]]}
                             [ngo:id (:token opt)])  ;; Tuple binding
        tx_result (when token:id
                        (tx-fn-put :invalidate-token
                                   '(fn [ctx eid]
                                        (let [db (xtdb.api/db ctx)
                                              entity (xtdb.api/entity db eid)]
                                             [[::xt/put (assoc entity :valid false)]])))
                        (tx-fn-call :invalidate-token token:id))]
       (sync)
       (boolean (:xtdb.api/tx-id tx_result))))

(s/def ::invalidate_token (t/resolver #'invalidate_token))
