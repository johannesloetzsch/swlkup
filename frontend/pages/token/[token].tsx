import { useRouter } from 'next/router'
import { LookupResult } from '../../components/LookupResult'
import { useLookupQuery } from '../../codegen/generates'
import styles from '../../styles/Core.module.css'

export default function Token() {
  const router = useRouter()
  const { token } = router.query
  const { data, isFetching } = useLookupQuery({token: token as string}, {staleTime: 60*1000})

  if(!token) {  /** can happen when loading the page the first time **/
    return ""
  } else if(isFetching) {
    return "loading…"
  } else if(data?.lookup.valid) {
    return ( <LookupResult data={data} /> )
  } else if(data) {
    return ( <p className={styles.center}>This is not a valid Token.<br/> Please try again.</p> )
  } else {
    return ( <p className={styles.center}>Sorry, something went wrong.<br/> Please try again.</p> )
  }
}
