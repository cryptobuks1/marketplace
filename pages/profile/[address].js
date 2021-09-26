import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getMetamaskUser } from '../../utils/Users'
import { getProfileNFTs } from '../../utils/NFTs'
import Jazzicon from '../../components/Misc/Jazzicon'
import styles from './address.module.scss'
import Card from '../../components/Cards/Card'

const address = ({ address, SUPABASE_URL, SUPABASE_KEY }) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const [profile, setProfile] = useState()
  const [signedWallet, setSignedWallet] = useState()
  const [profileNFTs, setProfileNFTs] = useState()
  
  const loadURL = (url) => window.open(url, '_self')

  const getProfile = async() => {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .match({address})

    data.length == 0 && window.open('/', '_self')

    const { name, username, bio, headerImage, profileImage, instagram, twitter } = data[0]
    setProfile({ address, name, username, bio, headerImage, profileImage, instagram, twitter })

    console.log(data)
  }

  useEffect(async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    getProfile()
    setSignedWallet(accounts[0])
    setProfileNFTs(await getProfileNFTs(address))
  }, [])
  
  return (
    <div className={styles.address}>
      {profile &&
        <div className={styles.profile}>
          {profile.profileImage ?
            <div className={styles.profileImg} style={{backgroundImage: `url(${profile.profileImage})`}} />
          :
            <Jazzicon account={profile.address} diameter={100} />
          }
          {address == signedWallet && <p className={styles.edit} onClick={() => loadURL(`/profile/update/${signedWallet}`)}>Edit Profile</p>}
          {profile.name && <p className={styles.name}>{profile.name}</p>}
          {profile.username && <p className={styles.username}>@{profile.username}</p>}

          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

          <ul>
            {profile.twitter && <li className={styles.social}><i className='fab fa-twitter'></i> {profile.twitter}</li>}
            {profile.instagram && <li className={styles.social}><i className='fab fa-instagram'></i> {profile.instagram}</li>}
            <li className={styles.address}><i className='fal fa-address-book'></i> {profile.address.slice(0, 6)}...{profile.address.slice(38, 42)}</li>
          </ul>
        </div>
      }

      {profileNFTs && 
        <div className={styles.cards}>
          {profileNFTs.map((nft, index) => (
            <Card 
              nft={nft}
              key={index} />
          ))}
        </div>}
    </div>
  )
}

export default address

export async function getServerSideProps(ctx) {
  const { address } = ctx.query
  const { SUPABASE_URL, SUPABASE_KEY } = process.env

  return {
    props: {
      address, SUPABASE_KEY, SUPABASE_URL
    }
  }
}