import { useState, useEffect } from 'react'
import styles from './LeftMenu.module.scss'
import Jazzicon from '../Misc/Jazzicon'
import { createClient } from '@supabase/supabase-js'
import { getUser } from '../../utils/Users';

const LeftMenu = ({menu}) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)
  const [address, setAddress] = useState()
  const [networkName, setNetworkName] = useState()
  const [networkTheme, setNetworkTheme] = useState()
  const [user, setUser] = useState()
  let networks = {
    '0x1': {name: 'Ethereum Main Network', theme: '#29b6af'},
    '0x3': {name: 'Ropsten Test Network', theme: '#ff4a8d'},
    '0x4': {name: 'Rinkeby Test Network', theme: '#f6c343'},
    '0x5': {name: 'Goerli Test Network', theme: '#3099f2'},
    '0x2a': {name: 'Kovan Test Network', theme: '#9064ff'},
    '0x38': {name: 'Binance Smart Chain', theme: '#f6c343'}
  }

  const loadURL = (url) => window.open(url, '_self')

  const connectMetamask = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const network = await ethereum.request({ method: 'eth_chainId' })

    const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .match({address: accounts[0]})

    if(data.length == 0) {
      await supabase
        .from('profiles')
        .insert({
          address: accounts[0]
        })
    }

    setAddress(accounts[0])
    setNetworkName(networks[network].name)
    setNetworkTheme(networks[network].theme)
    setUser(await getUser(accounts[0]))
  }

  useEffect(async() => {
    connectMetamask()
    setAddress(ethereum.selectedAddress)
  }, [])

  return (
    <div className={styles.leftMenu} style={{display: menu ? 'flex' : 'none'}}>
      <div className={styles.top} onClick={() => loadURL('/')}>
        <img src='/logo.png' alt='' />
        <div>
          <p className={styles.logoTxt}>WasteBridge</p>
          <p className={styles.motto}>Green Protocol</p>
        </div>
      </div>

      <div className={styles.menu}>
        <ul>
          <li onClick={() => loadURL('https://www.wastebridge.org')}><i className='fad fa-th-large'></i> Home</li>
          <li onClick={() => loadURL('https://swap.wastebridge.org')}><i className='fad fa-route'></i> Swap</li>
          <li className={styles.selected} onClick={() => loadURL('https://nft.wastebridge.org')}><i className='fad fa-store'></i> NFT Marketplace</li>
        </ul>
      </div>

      <div className={styles.bottom}>
        <ul className={styles.social}>
          <li onClick={() => loadURL('https://twitter.com/wastebridge')}><i className='fab fa-twitter'></i></li>
          <li onClick={() => loadURL('https://www.facebook.com/wastebridge')}><i className='fab fa-facebook-f'></i></li>
          <li onClick={() => loadURL('https://t.me/wastebridge')}><i className='fab fa-telegram-plane'></i></li>
        </ul>
    
        <ul className={styles.net}>
          {address ?
            <li className={styles.address}> 
              {user ?
                <div className={styles.img} style={{backgroundImage: `url(${user.profileImage})`}} />
              :
                <Jazzicon account={address} diameter={16} />
              }
              {address.slice(0, 6)}...{address.slice(38, 42)}
            </li> 
          :
            <li className={styles.address}>
              Connect MetaMask
            </li>}
          {networkTheme &&
            <li className={styles.network} style={{color: networkTheme, textShadow: `${networkTheme}4d 0 0 10px`}}>
              <i className='fas fa-circle'></i> 
              {networkName ? networkName : 'Unknown Network'}
            </li>} 
        </ul>
      </div>
    </div>
  )
}

export default LeftMenu
