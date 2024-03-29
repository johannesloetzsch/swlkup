import { useEffect } from 'react'
import { useAuthStore, AuthState, jwtFromLocalStorage } from '../Login'
import { SupervisorPasswordReset } from './SupervisorPasswordReset'
import { fetcher } from '../../codegen/fetcher'
import { useNgoQuery, Supervisors_Registered } from '../../codegen/generates'
import { useTranslation } from 'react-i18next';
import {Supervisor} from '../user/Supervisor'

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
    auth.setJwt(jwtFromLocalStorage())
  }, [auth.jwt])

  const { data, remove, refetch } = useNgoQuery({auth}, {enabled: Boolean(auth.jwt)})
  const registered_active = data?.supervisors_registered?.filter((s: Supervisors_Registered) => s.name_full)
  const registered_new = data?.supervisors_registered?.filter((s: Supervisors_Registered) => !s.name_full)

  return auth.jwt && (
    <div style={{width: "100%"}}>
      <h3>{ t('Supervisor') }</h3>
      <form onSubmit={ async event => { event.preventDefault()
                                        const mail = (document.getElementsByName('supervisor_email')[0] as HTMLInputElement).value
					remove()
					const mutated = await mutate(auth, mail)
                                        mutated && refetch()
                                        mutated && (document.getElementById('invitation_form') as HTMLFormElement).reset() }}
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
	    { registered_active?.map((s: Supervisors_Registered) =>
              <p>
	        { s.name_full + ' (' + s.mail + ')' } &nbsp;
	        <SupervisorPasswordReset supervisor={s.mail} />
	      </p>
	    ) }
          </>
        }
        { Boolean(registered_new?.length) &&
          <>
            <h5>{registered_new?.length} { t('New registered supervisors') }:</h5>
            { registered_new?.map((s: Supervisors_Registered) =>
	      <p>
		{ s.mail } &nbsp;
	        <SupervisorPasswordReset supervisor={s.mail} />
	      </p>
	    ) }
          </>
        }
      </form>
    </div>
  ) || null
}
