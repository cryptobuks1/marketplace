import styles from './User.module.scss'

const User = ({user, index}) => {
  const loadURL = (url) => window.open(url, '_self')

  return (
    <div className={styles.user} onClick={() => loadURL(`/profile/${user.address}`)}>
      {console.log(user)}
      <p className={styles.index}>{index + 1}</p>
      <div className={styles.img}>
        <div className={styles.imgInside} style={{backgroundImage: `url(${user.profileImage})`}}></div>
        {user.verified && <div className={styles.badge}><i className='fas fa-badge-check'></i></div>}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{user.name}</p>
        <p className={styles.spentBNB}>{user.spentBNB} BNB</p>
      </div>
    </div>
  )
}

export default User
