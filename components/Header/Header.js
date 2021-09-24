import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import Jazzicon from '../Misc/Jazzicon';
import styles from './Header.module.scss'
import { getUser } from '../../utils/Users';

const Header = () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY)
  const [wallet, setWallet] = useState()
  const [user, setUser] = useState()

  const loadURL = (url) => window.open(url, '_self')

  const metamaskInit = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
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

    setWallet(accounts[0])
    setUser(await getUser(accounts[0]))
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
          <div className={`${styles.connect} ${styles.btn}`} onClick={metamaskInit}>
            <img src='/images/logos/metamask.svg' />
            <p>Connect</p>
          </div>
        :
          <div className={styles.wallet} onClick={() => loadURL(`/profile/${wallet}`)}>
            {user ?
              <div className={styles.img} style={{backgroundImage: `url(${user.profileImage})`}} />
            :
              <Jazzicon account={wallet} diameter={16} />
            }
            <p>{wallet.slice(0, 6)}...{wallet.slice(38, 42)}</p>
          </div>
        }
      </div>
    </div>
  )
}

export default Header