import { useAuthStore, AuthState } from '../../components/Login'
import { useTranslation } from 'react-i18next';
import { fetcher } from '../../codegen/fetcher'
import { useSupervisorGetQuery } from '../../codegen/generates'

async function mutate_deactivate(auth: AuthState) {
  const result = await fetcher<any, any>(`mutation deactivate($auth: Auth) {
                                            supervisor_deactivate(auth: $auth, deactivated: true) }`,
                                         {auth})()
  return result?.supervisor_deactivate
}

export function DeactivateProfile() {
  const {t} = useTranslation()
  const auth = useAuthStore()
  const {refetch} = useSupervisorGetQuery({auth}, {enabled: Boolean(auth.jwt)})

  return (
    <>
      <br/>
      <input type="button" value={ t('Deactivate Profile') as string }
             onClick={async () => await mutate_deactivate(auth) && refetch()}
	     name="deactivate" />
    </>
  )
}
