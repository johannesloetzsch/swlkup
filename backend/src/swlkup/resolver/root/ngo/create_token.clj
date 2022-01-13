(ns swlkup.resolver.root.ngo.create-token
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.auth.core :refer [auth+role->entity]]
            [swlkup.auth.uuid.core :refer [uuid]]
            [swlkup.auth.token.generate :refer [generate-token]]
            [swlkup.model.token :as token]
            [swlkup.model.auth :as auth]
            [swlkup.model.ngo :as ngo]))

(s/fdef create_token
        :args (s/tuple map? (s/keys :req-un [::auth/auth ::token/purpose]) map? map?)
        :ret ::token/token)

(defn create_token
  [_node opt ctx _info]
  (let [{:keys [tx]} (:db_ctx ctx)
        [ngo:id] (auth+role->entity ctx (:auth opt) ::ngo/doc)]
       (when ngo:id
         (let [token (generate-token)]
              (tx [[:xtdb.api/put {:xt/id (uuid)
                                  :xt/spec ::token/doc
                                  :valid true
                                  :token token
                                  :ngo ngo:id
                                  :purpose (:purpose opt)}]])
              token))))

(s/def ::create_token (t/resolver #'create_token))
