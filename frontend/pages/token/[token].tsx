import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { request, gql } from 'graphql-request'
import { endpoint } from '../../config'
import { LookupResult } from '../../components/LookupResult'

function useLookup(token:string) {
  return useQuery(["gql", "lookup", token], async () => {
    const data = token && await request(
      endpoint,
      gql`
        query {
          lookup(token: "${token}") {
            ngo {
              name
            }
            supervisors {
              name_full
	      email
	      text
            }
          }   
        }
      `
    )
    return data
  }, {staleTime: 60000})
}

export default function Token() {
  const router = useRouter()
  const { token } = router.query
  const { data, isFetching } = useLookup(token as string)

  if(!token) {  /** can happen when loading the page the first time **/
    return ""
  } else if(isFetching) {
    return "loading…"
  } else if(data) {
    return ( <LookupResult data={data} /> )
  } else {
    return ( <p>Sorry, something went wrong.<br/> Maybe there is an <b><i>typing error in the Token</i></b>?<br/> Please try again.</p> )
  }
}
