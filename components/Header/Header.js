import { useState, useEffect } from 'react';
import styles from './Header.module.scss'
import Jazzicon from '../Misc/Jazzicon';

const Header = () => {
  const [wallet, setWallet] = useState()

  const loadURL = (url) => window.open(url, '_self')

  const metamaskInit = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    localStorage.setItem('wallet', accounts[0])
    setWallet(accounts[0])
  }

  useEffect(() => {
    metamaskInit()
  }, [])

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <img src='/images/logos/logo.png' onClick={() => loadURL('/')} />
      </div>
      
      <div className={styles.right}>
        <div className={styles.btn} onClick={() => loadURL('/create/erc721')}>
          <p>Create</p>
        </div>

        {!wallet ?
          <div className={`${styles.connect} ${styles.btn}`}>
            <img src='/images/logos/metamask.svg' />
            <p>Connect MetaMask</p>
          </div>
        :
          <div className={styles.wallet}>
            <Jazzicon account={wallet} diameter={16} />
            <p>{wallet.slice(0, 6)}...{wallet.slice(38, 42)}</p>
            <i className='fal fa-clone'></i>
          </div>
        }
      </div>
    </div>
  )
}

export default Header
