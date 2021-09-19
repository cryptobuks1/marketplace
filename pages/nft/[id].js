import Web3 from 'web3'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Jazzicon from '../../components/Misc/Jazzicon'
import styles from './id.module.scss'
const tokenABI = require('../../contracts/abis/Token.json')
const nftABI = require('../../contracts/abis/NFT.json')

const id = ({nft, SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT}) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  
  const [wallet, setWallet] = useState()
  const [processLoading, setProcessLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)
  const [listingLoading, setListingLoading] = useState(false)

  const loadURL = (url) => window.open(url)

  const listNFT = async() => {
    setListingLoading(true)

    const web3 = new Web3(ethereum)

    const listContract = new web3.eth.Contract(nftABI, NFT_CONTRACT)
    let listRes = await listContract.methods.updateListingStatus(nft.tokenID, true).send({from: wallet})
    console.log(listRes)
  
    const { data, error } = await supabase
      .from('json')
      .update({ isListed: true })
      .match({ uri: nft.uri })
    
    console.log(data)
    console.log(error)

    setListingLoading(false)
  }
  
  const buyNFT = async() => {
    setProcessLoading(true)

    const web3 = new Web3(ethereum)

    setApproveLoading(true)
    const approveContract = new web3.eth.Contract(tokenABI, TOKEN_CONTRACT)
    let approveRes = await approveContract.methods.approve(NFT_CONTRACT, BigInt(nft.price * 10 ** 18)).send({from: wallet});
    console.log(approveRes)
    setApproveLoading(false)

    setBuyLoading(true)
    const buyContract = new web3.eth.Contract(nftABI, NFT_CONTRACT)
    let buyRes = await buyContract.methods.buy(nft.tokenID).send({from: wallet})
    console.log(buyRes)
    setBuyLoading(false)
  
    const { data, error } = await supabase
      .from('json')
      .update({ holder: wallet, isListed: false })
      .match({ uri: nft.uri })
    
    console.log(data)
    console.log(error)
    

    setProcessLoading(false)
  } 

  useEffect(() => {
    setWallet(localStorage.getItem('wallet'))
  })

  return (
    <div className={styles.id}>
      {console.log(nft)}
      <div className={styles.img}>
        <div style={{backgroundImage: `url(${nft.data.image})`}}>
          <i className='far fa-search-plus' onClick={() => loadURL(nft.data.image)}></i>
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.name}>{nft.data.name}</p>

        <div className={styles.accounts}>
          <ul>
            <li>Owner:</li>
            <li><Jazzicon account={nft.owner} diameter={20} /> {nft.owner.slice(0, 6)}...{nft.owner.slice(38, 42)}</li>
          </ul>
          <ul>
            <li>Holder:</li>
            <li><Jazzicon account={nft.holder} diameter={20} /> {nft.holder.slice(0, 6)}...{nft.holder.slice(38, 42)}</li>
          </ul>
        </div>

        <p className={styles.description}>{nft.data.description}</p>

        {nft.isListed ?
          <div className={styles.buy}>
            <ul>
              <li>Price</li>
              <li>{nft.price} <span>WASTE</span></li>
            </ul>

            {nft.holder != wallet ? 
              <div className={styles.btn} onClick={buyNFT}>
                {processLoading ?
                  <>
                    <i className={`far fa-spinner-third ${styles.spinner}`}></i>
                    {approveLoading && <p>Approving</p>}
                    {buyLoading && <p>Buying</p>}
                  </>
                :
                  <p>Buy NFT</p>
                }
              </div>
            :
              <div className={`${styles.btn} ${styles.disabledBTN}`}>
                <p>Buy NFT</p>
              </div>    
            }
          </div>
        :
          <div className={styles.list}>
            <ul>
              <li>Not for sale</li>
              <li><span>Previous Price:</span> {nft.price} WASTE</li>
            </ul>
            {wallet == nft.holder &&
              <div className={styles.btn} onClick={listNFT}>
                {!listingLoading ?
                  <>
                    <i className='far fa-check'></i>
                    <p>List NFT</p>
                  </>
                :
                  <>
                    <i className={`far fa-spinner-third ${styles.spinner}`}></i>
                    <p>Listing NFT</p>
                  </>
                }
              </div>}
          </div>
        }
      </div>
    </div>
  )
}

export default id

export async function getServerSideProps(context) {
  const { SERVER_URL, SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT } = process.env

  const res = await axios.get(`${SERVER_URL}/api/nft/${context.query.id}`)
  const data = res.data

  return {
    props: {
      nft: data,
      SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, TOKEN_CONTRACT
    }
  }
}