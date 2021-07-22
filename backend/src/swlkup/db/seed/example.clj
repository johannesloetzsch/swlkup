(ns swlkup.db.seed.example)

;; An example dataset used for development and testing
(def example-db [{:crux.db/id :lifeline
                  :crux.spec :swlkup.model.ngo/ngo
                  :name "Mission Lifeline"}
                 {:crux.db/id :seawatch
                  :crux.spec :swlkup.model.ngo/ngo
                  :name "Sea-Watch"}])
