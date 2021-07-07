(ns swlkup.db)

(def example-db {:ngos [{:id :lifeline
                         :name "Mission Lifeline"}
                        {:id :seawatch
                         :name "Sea-Watch"}]
                 :supervisors [{:name_full "Max Müller"
                                :email "praxis@max.mueller.de"
                                :text "irgend etwas über mich ;)"
                                :lat 23.42
                                :lon 52.34}
                               {:name_full "Maria Musterfrau"
                                :email "maria@mm.de"
                                :text "todo"
                                :lat 13.37
                                :lon 42.23
                                :ngos #{:seawatch}}]
                 :usertokens [{:token "T0p53cret"
                               :ngo :seawatch}
                              {:token "R4nd0m"
                               :ngo :lifeline}]})

(def db example-db)
