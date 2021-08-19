(ns swlkup.auth.uuid.core)

(defn uuid []
  (str (java.util.UUID/randomUUID)))
