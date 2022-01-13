import { config, fetch_config } from "../config";
import { useEffect } from 'react'
import { useAuthStore, AuthState } from './Login'
import { fetcher } from '../codegen/fetcher'
import { useNgoQuery } from '../codegen/generates'
import { useTranslation, Trans } from 'react-i18next';

async function mutate(auth: AuthState, purpose: string) {
  const result = await fetcher<any, any>(`mutation Create($auth: Auth!, $purpose: String) {
					    create_token(auth: $auth, purpose: $purpose) }`,
                                         {auth, purpose})()
  return result.create_token
}

async function invalidate (auth: AuthState, token: string) {
  const result = await fetcher<any, any>(`mutation InvalidateToken($auth: Auth!, $token:String!) {
                                            invalidate_token(auth: $auth, token: $token) }`,
					 {auth, token})()
  return result.invalidate_token
}

export function CreateToken() {
  const {t} = useTranslation()
  useEffect( () => {fetch_config() }, [config])

  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(localStorage.getItem('jwt') || '')
  }, [auth.jwt])

  const { data, remove, refetch } = useNgoQuery({auth}, {enabled: Boolean(auth.jwt)})

  return (
    auth.jwt && <div style={{width: "100%"}}>
      <h3>{ t('Token') }</h3>

      <form onSubmit={ async event => { event.preventDefault()
                                        const purpose = (document.getElementsByName('purpose')[0] as HTMLInputElement).value
					remove()
					await mutate(auth, purpose)
                                        && refetch()
                                        && (document.getElementById('token_form') as HTMLFormElement).reset() }}
	    id="token_form">
        <fieldset>
	  <legend>{ t('Create a new Token') }</legend>
	  { t('Description of the group for whom you are creating the token') }<textarea name="purpose" required={true}/><br/>
	  <br/>
	  <input type="submit" value={ t('Create') as string }/>
        </fieldset>
      </form>

      { Boolean(data?.created_tokens.length) &&
	<>
          <h4>{data?.created_tokens.length} { t('Created Tokens') }:</h4>
          <ul>
          { data?.created_tokens.map(token =>
              <li key={token.token} style={{textDecoration: token.valid ? "none" : "line-through"}}>
                <a href={config.base_url+"/token/"+token.token} style={{fontFamily: "monospace"}} className="token">{token.token}</a>
                {token.purpose && " - " + token.purpose}
		&nbsp;
		{/* TODO: ask for confirmation and show token_disable_recommendation */}
		{token.valid && <input type="button" onClick={async () => await invalidate(auth, token.token) && refetch()} value={ t('Disable') as string } name={token.token} />}
              </li>
            )
          }
          </ul>
        </>
      }
    </div>
  ) || null
}
