import Head from 'next/head'
import Header from './Header/Header'

export const Layout = ({children}) => {
  return (
    <div>
      <Head>
        <link href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" rel="stylesheet" />
        <link rel='icon' type='image/png' href='/logoWhite.jpg' />
        <link rel="apple-touch-icon" href="/logoWhite.jpg" />
        <title>WasteBridge Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <Header />
      <main>{children}</main>
    </div>
  )
}
