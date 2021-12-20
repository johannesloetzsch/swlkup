import { useEffect } from 'react'
import { useAuthStore, AuthState } from './Login'
import { fetcher } from '../codegen/fetcher'
import { useNgoQuery } from '../codegen/generates'
import { useTranslation, Trans } from 'react-i18next';

async function mutate(auth: AuthState, mail: string) {
  const result = await fetcher<any, any>(`mutation Invite($auth: Auth!, $mail: String) {
					    supervisor_register(auth: $auth, mail: $mail) }`,
                                         {auth, mail})()
  console.debug(result)
  return result?.supervisor_register
}

export function InviteSupervisor() {
  const {t} = useTranslation()
  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(localStorage.getItem('jwt') || '')
  }, [auth.jwt])

  const { data, remove, refetch } = useNgoQuery({auth}, {enabled: Boolean(auth.jwt)})
  const registered_active = data?.supervisors_registered?.filter(s => s.name_full) 
  const registered_new = data?.supervisors_registered?.filter(s => !s.name_full) 

  return auth.jwt && (
    <div style={{width: "100%"}}>
      <h3>{ t('Supervisor') }</h3>
      <form onSubmit={ async event => { event.preventDefault()
                                        const mail = (document.getElementsByName('supervisor_email')[0] as HTMLInputElement).value
					remove()
					await mutate(auth, mail)
                                        && refetch()
                                        && (document.getElementById('invitation_form') as HTMLFormElement).reset() }}
	    id="invitation_form">
        <fieldset>
	  <legend>{ t('Invite a new Supervisor') }</legend>
	  { t('Mail address of Supervisor you want invite') }<input type="text" name="supervisor_email" required={true}/><br/>
	  <br/>
	  <input type="submit" value={ t('Invite') as string }/>
        </fieldset>

        { Boolean(registered_active?.length) &&
          <>
            <h4>{registered_active?.length} { t('Active registered supervisors') }:</h4>
            <p>{ registered_active?.map(s => s.name_full + ' (' + s.mail + ')').join(', ') }</p>
          </>
        }
        { Boolean(registered_new?.length) &&
          <>
            <h5>{registered_new?.length} { t('New registered supervisors') }:</h5>
            <p>{ registered_new?.map(s => s.mail).join(', ') }</p>
          </>
        }
      </form>
    </div>
  ) || null
}
