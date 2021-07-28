(ns swlkup.resolver.root.languages
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.languages :as languages]))

(s/fdef languages
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::languages/languages))

(defn languages
  "All languages"
  [_node _opt ctx _info]
  (let [{:keys [q_unary]} (:db_ctx ctx)]
       (q_unary '{:find [(pull ?e [*])]
                  :where [[?e :crux.spec :swlkup.model.languages/languages]]})))

(s/def ::languages (t/resolver #'languages))
