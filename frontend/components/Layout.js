import styles from '../styles/Layout.module.css'
import Head from 'next/head'
import QueryClientProvider from '../components/QueryClientProvider'

export default function Layout({children}) {
  return (
    <QueryClientProvider>
    <div className={styles.container}>
      <Head>
        <title>Supervisor Lookup</title>
        <meta name="description" content="Supervisor Lookup" />
	{/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className={styles.main}>{ children }</main>

      {/*
      <footer className={styles.footer}>
        something at the footer
      </footer>
      */}
    </div>
    </QueryClientProvider>
  )
}
