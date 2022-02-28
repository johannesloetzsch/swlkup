(ns swlkup.resolver.root.admin.export
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.login :as login]
            [swlkup.model.export :as export]
            [swlkup.auth.admin :refer [admin?]]
            [swlkup.db.export :refer [all_docs edn->pprint]]
            [swlkup.security.encryption.gpg :refer [encrypt]]
            [swlkup.config.state :refer [env]]))

(s/fdef export
        :args (s/tuple map? (s/keys :req-un [::login/password]) map? map?)
        :ret (s/nilable ::export/result))

(defn export
  "Export an encrypted database dump"
  [_node opt ctx _info]
  (when (admin? (:password opt))
        (-> (all_docs (:db_ctx ctx))
            (edn->pprint)
            (encrypt (:admin-gpg-id env)))))

(s/def ::export (t/resolver #'export))
