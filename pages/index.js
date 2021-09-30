import styles from '../styles/Home.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../components/Cards/Card'
import { createClient } from '@supabase/supabase-js'
import { getTrendingNFTs } from '../utils/NFTs'
import TopUsers from '../components/TopUsers/TopUsers'

export default function Home({data, SUPABASE_URL, SUPABASE_KEY}) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const [wallet, setWallet] = useState()
  const [s7DayTrending, set7DayTrending] = useState()
  const [dropdown, setDropdown] = useState(false)

  const metamaskInit = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setWallet(accounts[0])
  }

  useEffect(async() => {
    metamaskInit()
    set7DayTrending(await getTrendingNFTs())
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <p className={styles.title}>Trending NFTs in</p>
        <div className={styles.selection}>
          <div className={styles.days} onClick={() => setDropdown(!dropdown)}>
            <p>7 Days</p>
            <i className='fas fa-chevron-down'></i>
          </div>

          {dropdown && 
            <div className={styles.dropdown}>
              <p>24 Hours</p>  
              <p>7 Days</p>  
              <p>1 Month</p>  
            </div>}
        </div>
      </div>
      <div className={styles.horizontalCards}>
        {s7DayTrending && s7DayTrending.slice(0, 10).map((nft, index) => (
          <Card 
            nft={nft}
            wallet={wallet}
            supabase={supabase}
            key={index} />
        ))}
      </div>

      <TopUsers />

      <div className={styles.header}>
        <p className={styles.title}>Explore 🔥</p>
      </div>
      <div className={styles.cards}>
        {data.slice(0, 15).map((nft, index) => (
          <Card 
            nft={nft}
            wallet={wallet}
            supabase={supabase}
            key={index} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { SERVER_URL, SUPABASE_URL, SUPABASE_KEY } = process.env

  const res = await axios.get(`${SERVER_URL}/api/nft/all`)
  const data = res.data

  return {
    props: {
      data, SUPABASE_URL, SUPABASE_KEY
    }
  }
}
