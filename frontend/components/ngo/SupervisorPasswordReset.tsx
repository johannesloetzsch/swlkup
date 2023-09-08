import { useAuthStore, AuthState } from '../Login'
import { fetcher } from '../../codegen/fetcher'
import { useTranslation } from 'react-i18next';
import { create } from 'zustand'

type SupervisorMail = string;
type SupervisorPassword = string;

interface PasswortMap {
  [Key: SupervisorMail]: SupervisorPassword;
}

export interface PasswortMapState {
  passwortMap: PasswortMap,
  addPasswort: (mail: SupervisorMail, password: SupervisorPassword) => void,
}

export const usePasswortMapStore = create<PasswortMapState>(set => ({
  passwortMap: {},
  addPasswort: (mail, password) => set( orig => ({passwortMap: {...orig.passwortMap, [mail]: password}})),
}))

async function pwReset (auth: AuthState, supervisor: string, addPasswort: PasswortMapState["addPasswort"]) {
  const result = await fetcher<any, any>(`mutation SupervisorPasswordReset($auth: Auth!, $supervisor: SupervisorMail!) {
                                            supervisor_password_reset(auth: $auth, supervisor: $supervisor){mail, password} }`,
					 {auth, supervisor})()
  //console.log(result)
  const password = result.supervisor_password_reset.password
  addPasswort(supervisor, password)
}

export function SupervisorPasswordReset({supervisor}: {supervisor: string}) {
  const {t} = useTranslation()
  const auth = useAuthStore()
  const {passwortMap, addPasswort} = usePasswortMapStore()

  return (
    <>
      <input type="button" onClick={async () => { await pwReset(auth, supervisor, addPasswort) } }
             value={ t('Reset Password') as string } /*name={supervisor}*/ />
      &nbsp;
      { passwortMap[supervisor] }
    </>
  )
}
