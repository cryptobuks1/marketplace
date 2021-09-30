import styles from './Header.module.scss'

const Header = ({menu, setMenu}) => {
  const loadURL = (url) => window.open(url, '_self')

  return (
    <div className={styles.header}>
      <div className={styles.left}>
      </div>
      
      <div className={styles.right}>
        <div className={styles.btn} onClick={() => loadURL('/create/erc721')}>
          <p>Create</p>
        </div>

        <div className={`${styles.btn} ${styles.bar}`} onClick={() => setMenu(!menu)}>
          <i className='far fa-bars'></i>
        </div>
      </div>
    </div>
  )
}

export default Header