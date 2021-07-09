import { gql } from 'graphql-request'

export const lookup = gql`
  query Lookup($token: String="R4nd0m") {
    lookup(token: $token) {
      ngo {
        name
      }
      supervisors {
        name_full
        email
        text
      }
    }
  }`
