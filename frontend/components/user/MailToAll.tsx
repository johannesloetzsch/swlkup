import { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Supervisors } from '../../codegen/generates'
import { useAuthStore, jwtFromLocalStorage } from '../../components/Login'

export function MailToAll({filteredSupervisors}: {filteredSupervisors: Supervisors[]}) {
  const {t} = useTranslation()

  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(jwtFromLocalStorage())
  }, [auth.jwt])

  const recipients = filteredSupervisors
                     .map(supervisor => supervisor.contacts.email)
		     .filter(email => email)
		     .join(', ')

  /** displayed only when logged in, but not for pseudonym users **/
  return auth.jwt && recipients && (
    <div className="fullwidth">
      <h4>{ t('Mail to all') }</h4>
      <blockquote>
        { recipients }
      </blockquote>
    </div>
  ) || null
}
