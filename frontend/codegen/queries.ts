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
        text_job_title
        text_specialization
        text
	experience
	wants_newsletter
        location {
          country city zip
          type importance display_name lat lon diameter
        }
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
        country city zip
        type importance display_name lat lon diameter
      }
      text_job_title
      text_specialization
      text
      experience

      ngo

      wants_newsletter
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

export const supervisor_get_photo = gql`
  query SupervisorGetPhoto($auth: Auth!) {
    supervisor_get(auth: $auth) {
      photo
    }
  }`

export const ngo = gql`
  query Ngo($auth: Auth!) {
    created_tokens(auth: $auth) {token purpose valid}
    supervisors_registered(auth: $auth) {mail name_full}
  }`
