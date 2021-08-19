import { gql } from 'graphql-request'

export const login = gql`
  query Login($auth: Auth!) {
    login(auth: $auth) {jwt}
  }`

export const lookup = gql`
  query Lookup($token: String="R4nd0m") {
    lookup(token: $token) {
      valid
      ngo {
        name
      }
      supervisors {
        id
        name_full
        photo
        languages
        offers
        contacts {
          phone
          email
          website
        }
        text
      }
    }

    languages {
      id
      name
      flag_url
    }

    offers {
      id
      target
      desc
    }
  }`

export const supervisor_get = gql`
  query SupervisorGet($auth: Auth!) {
    supervisor_get(auth: $auth) {
      id
      ngos
      name_full
      languages
      offers
      contacts {
        phone
        website
        email
      }
      location {
        zip
      }
      photo
      text_specialization
      text
    }

    languages {
      id
      name
      flag_url
    }

    offers {
      id
      target
      desc
    }

    ngos(auth: $auth) {
      id
      name
    }
  }`

export const ngo = gql`
  query Ngo($auth: Auth!) {
    created_tokens(auth: $auth) {token purpose}
    supervisors_registered(auth: $auth) {mail name_full}
  }
`
