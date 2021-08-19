import { config, fetch_config } from "../config";
import { useEffect } from 'react'
import { useAuthStore, AuthState } from './Login'
import { fetcher } from '../codegen/fetcher'
import { useNgoQuery } from '../codegen/generates'

async function mutate(auth: AuthState, purpose: string) {
  console.log(purpose)
  const result = await fetcher<any, any>(`mutation Create($auth: Auth!, $purpose: String) {
					    create_token(auth: $auth, purpose: $purpose) }`,
                                         {auth, purpose})()
  console.debug(result)
  return result.create_token
}

export function CreateToken() {
  useEffect( () => {fetch_config() }, [config])

  const auth = useAuthStore()
  useEffect(() => {
    auth.setJwt(localStorage.getItem('jwt') || '')
  }, [auth.jwt])

  const { data, remove, refetch } = useNgoQuery({auth}, {enabled: Boolean(auth.jwt)})

  return (
    auth.jwt && <div style={{width: "100%"}}>
      <h4>Token</h4>

      <form onSubmit={ async event => { event.preventDefault()
                                        const purpose = (document.getElementsByName('purpose')[0] as HTMLInputElement).value
					remove()
					await mutate(auth, purpose)
                                        && refetch()
                                        && (document.getElementById('token_form') as HTMLFormElement).reset() }}
	    id="token_form">
        <fieldset>
	  <legend>Create a new Token</legend>
          Description of the group for whom you are creating the token: <textarea name="purpose" required={true}/><br/>
	  <br/>
	  <input type="submit" value="Create"/>
        </fieldset>
      </form>

      { Boolean(data?.created_tokens.length) &&
	<>
          <h5>{data?.created_tokens.length} Created Tokens:</h5>
          <ul>
          { data?.created_tokens.map(t =>
              <li key={t.token}> <a href={config.base_url+"/token/"+t.token} style={{fontFamily: "monospace"}}>{t.token}</a> {t.purpose && " - " + t.purpose}</li>
            )
          }
          </ul>
        </>
      }
    </div>
  ) || null
}