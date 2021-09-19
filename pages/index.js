import Web3 from 'web3'
import styles from '../styles/Home.module.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Card from '../components/Cards/Card'
import { createClient } from '@supabase/supabase-js'
const tokenABI = require('../contracts/abis/Token.json')
const nftABI = require('../contracts/abis/NFT.json')

export default function Home({data, SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT}) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const [wallet, setWallet] = useState()

  const metamaskInit = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setWallet(accounts[0])
  }

  useEffect(() => {
    metamaskInit()
    console.log(data)
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.cards}>
        {data.map((nft, index) => (
          <Card 
            Web3={Web3}
            nft={nft}
            wallet={wallet}
            supabase={supabase}
            tokenABI={tokenABI}
            nftABI={nftABI}
            NFT_CONTRACT={NFT_CONTRACT}
            TOKEN_CONTRACT={TOKEN_CONTRACT}
            key={index} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { SERVER_URL, SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT } = process.env

  const res = await axios.get(`${SERVER_URL}/api/nft/all`)
  const data = res.data

  return {
    props: {
      data, SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT
    }
  }
}
