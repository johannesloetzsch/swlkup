import { useRouter } from 'next/router'
import { create } from 'zustand'
import { useTranslation, Trans } from 'react-i18next';
import { Logos } from '../components/logos'

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
    <div style={{textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      <div style={{flexGrow: 5}}/>
      <div style={{flexGrow: 1}}>
        <div style={{backgroundColor: 'mintcream', display: 'inline-block', padding: '10px'}}>
        <p><Trans i18nKey="Please enter your access token">Please enter your <b>access token</b></Trans>:</p>
        <form onSubmit={ (event) => {event.preventDefault()
                                     router.push("/token/" + token/*, undefined, {shallow: true}*/)} }>
          <input name="token" onChange={(event) => setToken(event.target.value)}/>
          <input type="submit" value={t('Enter') as string}/>
        </form>
	</div>
      </div>
      <div style={{flexGrow: 5}}/>
      <div style={{width: '100%', maxHeight: '150px', flexGrow: 1}}>
        <Logos/>
      </div>
      <div style={{flexGrow: 1}}/>
    </div>
  )
}
