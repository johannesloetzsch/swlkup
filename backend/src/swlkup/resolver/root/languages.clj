(ns swlkup.resolver.root.languages
  (:require [clojure.spec.alpha :as s]
            [specialist-server.type :as t]
            [swlkup.model.languages :as languages]
            [swlkup.db :refer [db]]))

(s/fdef languages
        :args (s/tuple map? map? map? map?)
        :ret (s/* ::languages/languages))

(defn languages
  "All languages"
  [_node _opt _ctx _info]
  (:languages db))

(s/def ::languages (t/resolver #'languages))
