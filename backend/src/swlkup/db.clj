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
                                :photo "https://raw.githubusercontent.com/wiki/community-garden/community-garden.github.io/images/team_avatar_joe.png"
                                :login :todo
                                :email "praxis@max.mueller.de"
                                :languages [:de :en]
                                :offers #{:counselling :counselling_telephone :crisis_intervention}
                                :offers_online true
                                :offers_offline true
                                :contacts {:phone "0351 1234 5678"
                                           :website "https://max.mueller.de"}
                                :location {:zip "01022"
                                           :address_string "Leipziger Str. 13, 01022 Dresden"
                                           :lat 23.42
                                           :lon 52.34
                                           :radius_kilometer 10}
                                :text "Irgend etwas über mich ;)"}
                               {:name_full "Maria Musterfrau"
                                :photo "https://raw.githubusercontent.com/wiki/community-garden/community-garden.github.io/images/team_avatar_stephanie.png"
                                :login :todo
                                :email "maria@mm.de"
                                :languages [#_:de #_:en :it :es :fr :ar]
                                :offers #{:counselling :counselling_telephone :crisis_intervention
                                          :mediation :moderation :supervision :workshops}
                                :offers_online true
                                :offers_offline true
                                :contacts {:phone "+49 123 4567 8901"
                                           :website "https://mm.de"}
                                :location {:zip "01010"
                                           :address_string "Hauptstr. 7, 01010 Dresden"
                                           :lon 42.23
                                           :lat 13.37
                                           :radius_kilometer 10}
                                :text "Here I should write something about myself, my specialization and my motivation for supporting SAR NGOs…"
                                :ngos #{:seawatch}}]
                 :languages [{:id :en :name "English"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"}
                             {:id :de :name "Deutsch"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg"}
                             {:id :it :name "Italiano"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg"}
                             {:id :es :name "Español"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"}
                             {:id :fr :name "Français"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"}
                             {:id :ar :name "العربية"
                              :flag_url "https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_the_Arabic_language.svg"}]
                 :offers [{:id :counselling
                           :target :individual
                           :desc "Counselling for individuals"}
                          {:id :crisis_intervention
                           :target :individual
                           :desc "Crisis intervention for individuals"}
                          {:id :briefing
                           :target :group
                           :desc "Psychological briefing & debriefing of crews"}
                          {:id :moderation
                           :target :group
                           :desc "Moderation"}
                          {:id :mediation
                           :target :group
                           :desc "Mediation"}
                          {:id :supervision
                           :target :group
                           :desc "Supervision"}
                          {:id :workshops
                           :target :group
                           :desc "Workshops"}

                          #_{:id :coaching}
                          #_{:id :translation}
                         ]})

(def db example-db)
