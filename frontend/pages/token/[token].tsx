import { useRouter } from 'next/router'
import { LookupResult } from '../../components/LookupResult'
import { useLookupQuery } from '../../codegen/generates'

export default function Token() {
  const router = useRouter()
  const { token } = router.query
  const { data, isFetching } = useLookupQuery({token: token as string}, {staleTime: 60*1000})

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
