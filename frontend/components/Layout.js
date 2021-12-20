import styles from '../styles/Layout.module.css'
import Head from 'next/head'
import QueryClientProvider from '../components/QueryClientProvider'
import { useTranslation, Trans } from 'react-i18next';
import constants from '../i18n/const.json'

export default function Layout({children}) {
  const {t} = useTranslation()

  return (
    <QueryClientProvider>
      <div className={styles.container}>
        <Head>
          <title>Supervisor Lookup</title>
          <meta name="description" content="Supervisor Lookup" />
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>

        <div className={styles.header}>
          <div>LangSelection</div>
          <div className={styles.slogan}>
            <h1>psychological.<wbr/>contact</h1>
            Find support from the SAR Network
          </div>
          <div>{/*Login*/}</div>
        </div>

        <main className={styles.main}>{ children }</main>

        <footer className={styles.footer}>
          <div><a href={constants.url_impressum}>{ t('Impressum') }</a></div>
          <div><a href={constants.url_privacy_policy}>{ t('Privacy policy') }</a></div>
          <div><a href={constants.url_source}>{ t('Source') }</a></div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}
