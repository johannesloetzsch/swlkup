(ns lib.misc.filter-one)

(defn filter-one
  "Like filter, but ensures that there is exactly one result.
   Optionally the throwable can be defined."
  ([pred coll]
    (filter-one nil pred coll))
  ([throwable pred coll]
    (let [matches (filter pred coll)]
         (if (= 1 (count matches))
             (first matches)
             (throw (or throwable
                        (Error. (str "Expected exactly 1 match. Got: " (into [] matches)))))))))
