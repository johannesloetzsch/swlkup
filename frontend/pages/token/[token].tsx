import { useRouter } from 'next/router'
import { LookupResult } from '../../components/user/LookupResult'
import { useLookupQuery } from '../../codegen/generates'
import styles from '../../styles/Core.module.css'
import { useTranslation, Trans } from 'react-i18next';

export default function Token() {
  const {t} = useTranslation()
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
    {/* TODO: distinct error when token was invalidated */}
    return ( <p className={styles.center}>{ t('This is not a valid Token.') }<br/>{ t('Please try again.') }</p> )
  } else {
    return ( <p className={styles.center}>{ t('Sorry, something went wrong.') }<br/>{ t('Please try again.') }</p> )
  }
}
