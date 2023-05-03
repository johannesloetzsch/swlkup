import { useAuthStore, AuthState } from '../Login'
import { fetcher } from '../../codegen/fetcher'
import { Created_Tokens } from '../../codegen/generates'
import { useTranslation } from 'react-i18next';
import create from 'zustand'

export interface ConfirmationState {
  openedConfirmationFor: string,
  setOpenedConfirmationFor: (token: string) => void,
}

export const useConfirmationStore = create<ConfirmationState>(set => ({
  openedConfirmationFor: '',
  setOpenedConfirmationFor: (token) => set( _orig => ({openedConfirmationFor: token})),
}))

async function invalidate (auth: AuthState, token: string) {
  const result = await fetcher<any, any>(`mutation InvalidateToken($auth: Auth!, $token:String!) {
                                            invalidate_token(auth: $auth, token: $token) }`,
					 {auth, token})()
  return result.invalidate_token
}

export function InvalidateTokenDialog({token, refetch}:
                                      {token: Created_Tokens, refetch: any}) {
  const {t} = useTranslation()
  const auth = useAuthStore()
  const {openedConfirmationFor, setOpenedConfirmationFor} = useConfirmationStore()

  return (
    <>
      { openedConfirmationFor == token.token && <>
	  <br/>
	  <label>
            <input type="checkbox" id="confirm_invalidation"/>
            { t("I'm sure I want to disable this token.") }<br/>
	  </label>
        </>
      }
      <input type="button" onClick={async () => { if(openedConfirmationFor !== token.token) {
                                                    setOpenedConfirmationFor(token.token)
                                                  } else if((document.getElementById('confirm_invalidation') as HTMLInputElement).checked) {
                                                    await invalidate(auth, token.token) && refetch()
						  } }}
             value={ t('Disable') as string } name={token.token} />
    </>
  )
}
