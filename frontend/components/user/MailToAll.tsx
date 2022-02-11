import { useTranslation } from 'react-i18next';
import { Supervisors } from '../../codegen/generates'

/** TODO show only when logged in as ngo **/
export function MailToAll({filteredSupervisors}: {filteredSupervisors: Supervisors[]}) {
  const {t} = useTranslation()
  const recipients = filteredSupervisors?.map( supervisor => supervisor.contacts.email ).join(', ')

  return recipients && (
    <div className="fullwidth">
      <h4>{ t('Mail to all') }</h4>
      <blockquote>
        { recipients }
      </blockquote>
    </div>
  ) || null
}
