(ns swlkup.db.validate
  (:require [clojure.spec.alpha :as s]
            [swlkup.db.export :refer [all_docs write-edn]]
            [clojure.pprint :refer [pprint]]))

(defn validate
  "Validate a crux-document or a collection of documents.
   When not conforming to the spec, an explaination is associated."
  [doc]
  (if (map? doc)
      (let [spec (:crux.spec doc)]
           (if (s/valid? spec doc)
               doc 
               (assoc doc :explain (s/explain-data spec doc))))
      (map validate doc)))

(defn validate-db
  "Validate the database.
   The db_ctx is only returned, when all documents have been confirmed."
  [db_ctx]
  (let [validated-docs (validate (all_docs db_ctx))
        errors (filter :explain validated-docs)
        file "/tmp/validation-errors"]
       (if (not-empty errors)
           (do
             (println "There have been validation errors in" (count errors) "database documents.")
             (println "It seems that the latest update changed this specs:" (into [] (keys (group-by :crux.spec errors))))
             (write-edn file errors)
             (println "Details have been written to:" file))
           db_ctx)))

(defn validate-tx
  "Validate docs before they are written to the database."
  [tx-ops]
  (let [docs (->> tx-ops
                  (filter #(= :crux.tx/put (first %)))
                  (map second))
        errors (filter :explain (validate docs))]
       (if (not-empty errors)
           (do (println "Transaction canceled due to validiation errors:")
               (pprint errors))
           tx-ops)))
