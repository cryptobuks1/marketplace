import { useState } from 'react'
import Jazzicon from '../Misc/Jazzicon'
import styles from './Card.module.scss'

const Card = ({Web3, nft, wallet, supabase, tokenABI, nftABI, NFT_CONTRACT, TOKEN_CONTRACT}) => {
  const [processLoading, setProcessLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)

  const loadURL = (url) => window.open(url, '_self')
  
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

  return (
    <div className={styles.card}>
      <div className={styles.pfp}>
        <Jazzicon account={nft.holder} diameter={18} />
        <p>{nft.holder.slice(0, 6)}...{nft.holder.slice(38, 42)}</p>
      </div>
      <div className={styles.img} onClick={() => loadURL(`/nft/${nft.id}`)}>
        <img src={nft.data.image} alt='' />
      </div>
      <p className={styles.name}>{nft.data.name}</p>
      <div className={styles.quickBuy}>
        <p className={styles.price}>{nft.price} <span>WASTE</span></p>
        {nft.isListed ?
          nft.holder != wallet ? 
            <div className={styles.btn} onClick={buyNFT}>
              {processLoading ?
                <>
                  <i className={`far fa-spinner-third ${styles.spinner}`}></i>
                  {approveLoading && <p>Approving</p>}
                  {buyLoading && <p>Buying</p>}
                </>
              :
                <p>Buy</p>
              }
            </div>
          :
            <div className={`${styles.btn} ${styles.disabledBTN}`}>
              <p>Buy</p>
            </div>
        :
          <div className={styles.notForSale}>
            <p>Not for Sale</p>
          </div>
        }
      </div> 
      {/* TEST */}
    </div>
  )
}

export default Card
