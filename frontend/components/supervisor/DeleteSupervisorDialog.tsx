import create from 'zustand'
import { useAuthStore, AuthState } from '../../components/Login'
import { fetcher } from '../../codegen/fetcher'
import { useTranslation } from 'react-i18next';

export interface DeleteState {
  openedConfirmation: boolean,
  setOpenedConfirmation: () => void,
  deleted: boolean,
  setDeleted: () => void
}

export const useDeleteStore = create<DeleteState>(set => ({
  openedConfirmation: false,
  setOpenedConfirmation: () => set( _orig => ({openedConfirmation: true})),
  deleted: false,
  setDeleted: () => set( _orig => ({deleted: true}) )
}))

async function mutate_delete(auth: AuthState) {
  const result = await fetcher<any, any>(`mutation delete($auth: Auth) {
                                            supervisor_delete(auth: $auth) }`,
                                         {auth})()
  return result?.supervisor_delete
}

export function DeleteSupervisorDialog() {
  const {t} = useTranslation()
  const auth = useAuthStore()
  const {openedConfirmation, setOpenedConfirmation, setDeleted} = useDeleteStore()

  return (
    <>
      <br/>
      <div style={{textAlign: "left",
                   display: openedConfirmation ? "block" : "none"}}>
        <label>
          <input type="checkbox" id="confirm_delete"/>
          { t("I'm sure I want delete my account. All data stored about me will be deleted. I will not be able to login any longer.") }
        </label>
      </div>
      <input type="button" value={ t('Delete Profile') as string }
             onClick={async () => { if(!openedConfirmation) {
		                      setOpenedConfirmation()
		                    } else if((document.getElementById('confirm_delete') as HTMLInputElement).checked
                                              && await mutate_delete(auth)) {
                                      setDeleted()
				      auth.logout()
				    } }}
             name="delete"/>
    </>
  )
}
