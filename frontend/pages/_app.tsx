import Layout from '../components/Layout'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../i18n/config'

function MyApp({ Component, pageProps }: AppProps) {
  return (<Layout>
	    <Component {...pageProps} />
	  </Layout>)
}
export default MyApp
