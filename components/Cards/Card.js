import { useEffect, useState } from 'react'
import { getUser } from '../../utils/Users'
import Jazzicon from '../Misc/Jazzicon'
import styles from './Card.module.scss'

const Card = ({nft}) => {
  const [holder, setHolder] = useState()
  const [dropdown, setDropdown] = useState(false)

  const loadURL = (url) => window.open(url, '_self')

  useEffect(async() => {
    setHolder(await getUser(nft.holder))
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.toolbox}>
        <div className={styles.toolbtn} onClick={() => setDropdown(!dropdown)}>
          <i className='far fa-ellipsis-h'></i>
        </div>

        {dropdown &&
          <div className={styles.dropdown}>
            <p>Share</p>  
            <p onClick={() => loadURL(`/nft/${nft.id}`)}>Buy Now</p>  
          </div>}
      </div>
      <div className={styles.img} onClick={() => loadURL(`/nft/${nft.id}`)}>
        <div style={{backgroundImage: `url(${nft.data.image})`}} />

        {holder && holder.profileImage ?
          <div className={styles.profileImage} style={{backgroundImage: `url(${holder.profileImage})`}}></div>
          :
          <Jazzicon account={nft.holder} diameter={34} />
        }
      </div>
      <div className={styles.details}>
        <p className={styles.name}>{nft.data.name}</p>

        <div className={styles.bottom}>
          <p className={styles.price}>{nft.price} <span>BNB</span></p>
        </div>
      </div>
    </div>
  )
}

export default Card
