(ns swlkup.resolver.root.languages
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.languages :as languages]
            [swlkup.db.state :refer [q_unary]]))

(s/fdef languages
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::languages/languages))

(defn languages
  "All languages"
  [_node _opt _ctx _info]
  (q_unary '{:find [(pull ?e [*])]
             :where [[?e :crux.spec :swlkup.model.languages/languages]]}))

(s/def ::languages (t/resolver #'languages))
