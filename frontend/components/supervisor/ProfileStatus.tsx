import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../components/Login'
import { Supervisors } from '../../codegen/generates'
import { DeleteSupervisorDialog, useDeleteStore } from '../../components/supervisor/DeleteSupervisorDialog'
import { DeactivateProfile } from '../../components/supervisor/DeactivateProfile'

export function ProfileStatus({supervisor}: {supervisor: Supervisors|undefined}) {
  const {t} = useTranslation()
  const {deleted} = useDeleteStore()
  const auth = useAuthStore()
  const status = deleted && "deleted" ||
	         !auth.jwt && "logged_out" ||
	         !supervisor && "new" ||
		 supervisor?.deactivated && "deactivated" ||
		 "activated"
  const status_color = ({deleted: "orange", logged_out: "lavender", new: "lavender", deactivated: "lightyellow", activated: "lightgreen"})[status]
  const status_message = ({deleted: 'Your Account has been deleted.',
			   logged_out: 'Please login to edit your profile.',
			   new: 'Please create your profile by submitting the form below.',
                           deactivated: "Your profile is inactive. To activate it, please submit the form below.",
			   activated: 'Your profile is online and can be found by users with an valid token.'})[status]

  return (
    <>
      <div style={{backgroundColor: status_color, width: "100%", padding: "1em", border: "1px solid"}}>
        { t(status_message) }

	<div style={{textAlign: "right"}}>
	  { status === 'activated' && <DeactivateProfile/> }
          { supervisor && <DeleteSupervisorDialog/> }
        </div>
      </div>
    </>
  )
}
