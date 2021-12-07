import { useRouter } from 'next/router'
import create from 'zustand'
import { useTranslation, Trans } from 'react-i18next';

interface TokenState {
  token: string
  setToken: (token: string) => void
}

const useTokenStore = create<TokenState>(set => ({
  token: "",
  setToken: (token) => set(() => ({token})),
}))

export default function Home() {
  const {t} = useTranslation()
  const {token, setToken} = useTokenStore()
  const router = useRouter()

  return (
    <div>
      <p><Trans i18nKey="Please enter your <1>access token</1>">Please enter your <b>access token</b></Trans>:</p>
      <form onSubmit={ (event) => {event.preventDefault()
                                   router.push("/token/" + token/*, undefined, {shallow: true}*/)} }>
        <input name="token" onChange={(event) => setToken(event.target.value)}/>
        <input type="submit" value={t('Enter') as string}/>
      </form>
    </div>
  )
}
