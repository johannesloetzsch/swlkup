import { gql } from 'graphql-request'

export const lookup = gql`
  query Lookup($token: String="R4nd0m") {
    lookup(token: $token) {
      ngo {
        name
      }
      supervisors {
        name_full
	photo
	languages
	offers
	contacts {
	  phone
	  website
	}
        email
        text
      }
    }

    languages {
      id
      name
      flag_url
    }
  }`
