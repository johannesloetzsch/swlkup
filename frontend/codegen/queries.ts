import { gql } from 'graphql-request'

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

export const login = gql`
  query Login($auth: Auth!) {
    login(auth: $auth) {jwt}
  }`
