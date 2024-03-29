import { config } from "../../config";
import { useEffect } from 'react'
import { useAuthStore, AuthState, jwtFromLocalStorage } from '../Login'
import { fetcher } from '../../codegen/fetcher'
import { useNgoQuery } from '../../codegen/generates'
import { useTranslation, Trans } from 'react-i18next';
import { InvalidateTokenDialog } from './InvalidateTokenDialog'

async function mutate(auth: AuthState, purpose: string) {
  const result = await fetcher<any, any>(`mutation Create($auth: Auth!, $purpose: String) {
					    create_token(auth: $auth, purpose: $purpose) }`,
                                         {auth, purpose})()
  return result.create_token
}

export function CreateToken() {
  const {t} = useTranslation()

  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(jwtFromLocalStorage())
  }, [auth.jwt])

  const { data, remove, refetch } = useNgoQuery({auth}, {enabled: Boolean(auth.jwt)})

  return (
    auth.jwt && <div style={{width: "100%"}}>
      <h3>{ t('Token') }</h3>

      <form onSubmit={ async event => { event.preventDefault()
                                        const purpose = (document.getElementsByName('purpose')[0] as HTMLInputElement).value
					remove()
					const mutated = await mutate(auth, purpose)
                                        mutated && refetch()
                                        mutated && (document.getElementById('token_form') as HTMLFormElement).reset() }}
	    id="token_form">
        <fieldset>
	  <legend>{ t('Create a new Token') }</legend>
	  { t('Description of the group for whom you are creating the token') }<textarea name="purpose" required={true}/><br/>
	  <br/>
	  <input type="submit" value={ t('Create') as string }/>
        </fieldset>
      </form>

      <p><Trans i18nKey={'token_disable_recommendation'}/></p>

      { Boolean(data?.created_tokens.length) &&
	<>
          <h4>{data?.created_tokens.length} { t('Created Tokens') }:</h4>
          <ul>
          { data?.created_tokens
		  .sort((t1, t2) => ((t2.valid ? 1 : 0) - (t1.valid ? 1 : 0)))
		  .map(token =>
              <li key={token.token} style={{textDecoration: token.valid ? "none" : "line-through"}}>
                <a href={config.base_url+"/token/"+token.token} style={{fontFamily: "monospace"}} className={`token_${token.valid ? 'valid' : 'invalid'}`}>{token.token}</a>
                { token.purpose && " - " + token.purpose }
		&nbsp;
                { token.valid && <InvalidateTokenDialog token={token} refetch={refetch}/> }
              </li>
            )
          }
          </ul>
        </>
      }
    </div>
  ) || null
}
