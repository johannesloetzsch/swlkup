(ns swlkup.db)

(def example-db {:usertokens [{:token "T0p53cret"
                               :ngo :seawatch}
                              {:token "R4nd0m"
                               :ngo :lifeline}]
                 :ngos [{:id :lifeline
                         :name "Mission Lifeline"}
                        {:id :seawatch
                         :name "Sea-Watch"}]
                 :supervisors [{:name_full "Max Müller"
                                :login :todo
                                :email "praxis@max.mueller.de"
                                :languages [:de :en]
                                :offers #{:counselling :counselling_telephone :crisis_intervention}
                                :text "irgend etwas über mich ;)"
                                #_#_:contacts {:phone "0351 1234 5678"
                                           :website "https://max.mueller.de"}
                                :lat 23.42
                                :lon 52.34}
                               {:name_full "Maria Musterfrau"
                                :login :todo
                                :email "maria@mm.de"
                                :languages [:de :en :it :es :fr :ar]
                                :offers #{:counselling :counselling_telephone :crisis_intervention
                                          :mediation :moderation :supervision :workshops}
                                :text "todo"
                                :lat 13.37
                                :lon 42.23
                                :ngos #{:seawatch}}]
                 :languages [{:id :de
                              :name "Deutsch"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/180px-Flag_of_Germany.svg.png"}]
                 :offers [{:id :counselling
                           :target :individual
                           :desc "sessions for individuals (maybe this could also be framed as 'counselling with individuals'"}
                          {:id :counselling_telephone
                           :target :individual}
                          {:id :crisis_intervention
                           :target :individual}

                          {:id :briefing
                           :target :group
                           :desc "psychological briefing & debriefing of crews"}
                          {:id :moderation
                           :target :group}
                          {:id :mediation
                           :target :group}
                          {:id :supervision
                           :target :group}
                          {:id :workshops
                           :target :group}

                          {:id :coaching}
                          {:id :translation}
                         ]})

(def db example-db)
