import { useRouter } from 'next/router'
import create from 'zustand'

interface TokenState {
  token: string
  setToken: (token: string) => void
}

const useTokenStore = create<TokenState>(set => ({
  token: "",
  setToken: (token) => set(() => ({token})),
}))

export default function Home() {
  const {token, setToken} = useTokenStore()
  const router = useRouter()

  return (
    <div>
      <p>Please enter your <i><b>access token</b></i></p>
      <form onSubmit={ (event) => {event.preventDefault()
                                   router.push("/token/" + token/*, undefined, {shallow: true}*/)} }>
        <input name="token" onChange={(event) => setToken(event.target.value)}/>
        <input type="submit" value="Enter"/>
      </form>
    </div>
  )
}
