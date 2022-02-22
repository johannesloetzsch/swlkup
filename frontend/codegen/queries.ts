import { gql } from 'graphql-request'

export const login = gql`
  query Login($auth: Auth!) {
    login(auth: $auth) {jwt}
  }`

export const languages = gql`
  query Languages {
    languages {
      id
      name
      flag_url
      idx
    }
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
      idx
    }

    offers {
      id
      target
      idx
    }
  }`

export const supervisor_get = gql`
  query SupervisorGet($auth: Auth!) {
    supervisor_get(auth: $auth) {
      id
      deactivated
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
      idx
    }

    offers {
      id
      target
      idx
    }

    ngos(auth: $auth) {
      id
      name
    }
  }`

export const ngo = gql`
  query Ngo($auth: Auth!) {
    created_tokens(auth: $auth) {token purpose valid}
    supervisors_registered(auth: $auth) {mail name_full}
  }`
