(ns swlkup.db.seed.example)

;; An example dataset used for development and testing
(def example-db [
  {:crux.db/id :en
   :id "en"
   :crux.spec :swlkup.model.languages/languages
   :name "English"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"}
  {:crux.db/id :de
   :id "de"
   :crux.spec :swlkup.model.languages/languages
   :name "Deutsch"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg"}
  {:crux.db/id :it
   :id "it"
   :crux.spec :swlkup.model.languages/languages
   :name "Italiano"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg"}
  {:crux.db/id :es
   :id "es"
   :crux.spec :swlkup.model.languages/languages
   :name "Español"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"}
  {:crux.db/id :fr
   :id "fr"
   :crux.spec :swlkup.model.languages/languages
   :name "Français"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"}
  {:crux.db/id :ar
   :id "ar"
   :crux.spec :swlkup.model.languages/languages
   :name "العربية"
   :flag_url "https://upload.wikimedia.org/wikipedia/commons/0/0e/Flag_of_the_Arabic_language.svg"}

  {:crux.db/id :counselling
   :id "counselling"
   :crux.spec :swlkup.model.offers/offers
   :target :individual
   :desc "Counselling for individuals"}
  {:crux.db/id :crisis_intervention
   :id "crisis_intervention"
   :crux.spec :swlkup.model.offers/offers
   :target :individual
   :desc "Crisis intervention for individuals"}
  {:crux.db/id :briefing
   :id "briefing"
   :crux.spec :swlkup.model.offers/offers
   :target :group
   :desc "Psychological briefing & debriefing of crews"}
  {:crux.db/id :moderation
   :id "moderation"
   :crux.spec :swlkup.model.offers/offers
   :target :group
   :desc "Moderation"}
  {:crux.db/id :mediation
   :id "mediation"
   :crux.spec :swlkup.model.offers/offers
   :target :group
   :desc "Mediation"}
  {:crux.db/id :supervision
   :id "supervison"
   :crux.spec :swlkup.model.offers/offers
   :target :group
   :desc "Supervision"}
  {:crux.db/id :workshops
   :id "workshops"
   :crux.spec :swlkup.model.offers/offers
   :target :group
   :desc "Workshops"}

  #_{:crux.db/id :coaching
   :crux.spec :swlkup.model.offers/offers
     }
  #_{:crux.db/id :translation
   :crux.spec :swlkup.model.offers/offers
     }

  {:crux.db/id :lifeline
   :crux.spec :swlkup.model.ngo/ngo
   :name "Mission Lifeline"}
  {:crux.db/id :seawatch
   :crux.spec :swlkup.model.ngo/ngo
   :name "Sea-Watch"}

  {:crux.db/id :T0p53cret
   :token "T0p53cret"
   :ngo :seawatch}
  {:crux.db/id :R4nd0m
   :token "R4nd0m"
   :ngo :lifeline}

  {:crux.db/id :MaxMüller
   :crux.spec :swlkup.model.supervisor/supervisor
   :name_full "Max Müller"
   :photo "https://raw.githubusercontent.com/wiki/community-garden/community-garden.github.io/images/team_avatar_joe.png"
   :login :todo
   :email "praxis@max.mueller.de"
   :languages [:de :en]
   :offers #{:counselling :counselling_telephone :crisis_intervention}
   :contacts {:phone "0351 1234 5678"
              :website "https://max.mueller.de"}
   :location {:zip "01022"
              :address_string "Leipziger Str. 13, 01022 Dresden"
              :lat 23.42
              :lon 52.34
              :radius_kilometer 10}
   :text "Irgend etwas über mich ;)"
   :ngos :any}
  {:crux.db/id :MariaMusterfrau
   :crux.spec :swlkup.model.supervisor/supervisor
   :name_full "Maria Musterfrau"
   :photo "https://raw.githubusercontent.com/wiki/community-garden/community-garden.github.io/images/team_avatar_stephanie.png"
   :login :todo
   :email "maria@mm.de"
   :languages [:it :es :fr :ar]
   :offers #{:counselling :counselling_telephone :crisis_intervention
             :mediation :moderation :supervision :workshops}
   :contacts {:phone "+49 123 4567 8901"
              :website "https://mm.de"}
   :location {:zip "01010"
              :address_string "Hauptstr. 7, 01010 Dresden"
              :lon 42.23
              :lat 13.37
              :radius_kilometer 10}
   :text "Here I should write something about myself, my specialization and my motivation for supporting SAR NGOs…"
   :ngos #{:seawatch :sosmediterranee}}
])
