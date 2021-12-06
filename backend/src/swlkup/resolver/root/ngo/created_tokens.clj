(ns swlkup.resolver.root.ngo.created-tokens
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.model.token :as token]
            [swlkup.model.auth :as auth]
            [swlkup.model.ngo :as ngo]))

(s/fdef created_tokens
        :args (s/tuple map? (s/keys :req-un [::auth/auth]) map? map?)
        :ret (s/coll-of ::token/token_struct))

(defn created_tokens
  [_node opt ctx _info]
  (let [{:keys [q]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)]
       (when ngo:id
         (let [tokens (q '{:find [?token ?purpose]
                           :keys [token purpose]
                           :where [[?t :xt/spec :swlkup.model.token/doc]
                                   [?t :ngo ->ngo:id]
                                   [?t :token ?token]
                                   [?t :purpose ?purpose]]
                           :in [->ngo:id]}
                          ngo:id)]
              tokens))))

(s/def ::created_tokens (t/resolver #'created_tokens))
