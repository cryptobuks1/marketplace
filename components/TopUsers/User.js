import styles from './User.module.scss'
import Jazzicon from '../Misc/Jazzicon'

const User = ({user, index}) => {
  const loadURL = (url) => window.open(url, '_self')

  return (
    <div className={styles.user} onClick={() => loadURL(`/profile/${user.address}`)}>
      {console.log(user)}
      <p className={styles.index}>{index + 1}</p>
      <div className={styles.img}>
        {user.profileImage ?
          <div className={styles.imgInside} style={{backgroundImage: `url(${user.profileImage})`}}></div>
        :
          <Jazzicon diameter={40} account={user.address} />
        }
        {user.verified && <div className={styles.badge}><i className='fas fa-badge-check'></i></div>}
      </div>

      <div className={styles.info}>
        {user.name ?
          <p className={styles.name}>{user.name}</p>
        :
          <p className={styles.name}>{user.address.slice(0, 6)}...{user.address.slice(38, 42)}</p>
        }
        <p className={styles.spentBNB}>{user.spentBNB} BNB</p>
      </div>
    </div>
  )
}

export default User
