import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from './Header/Header'
import LeftMenu from './Header/LeftMenu'
import Footer from './Footer/Footer'

export const Layout = ({children}) => {  
  const [menu, setMenu] = useState()

  useEffect(() => {
    setMenu(window.innerWidth > 650 ? true : false)
  }, [])
  
  return (
    <div>
      <Head>
        <link href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" rel="stylesheet" />
        <link rel='icon' type='image/png' href='/logoWhite.jpg' />
        <link rel="apple-touch-icon" href="/logoWhite.jpg" />
        <title>Marketplace - WasteBridge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      <div className='layout'>
        <LeftMenu menu={menu} />

        <div className='rightMenu'>
          <Header menu={menu} setMenu={setMenu} />
          <main>
            {children}  
          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  )
}
