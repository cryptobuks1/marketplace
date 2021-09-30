import styles from './Footer.module.scss'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.logo}>WasteBridge</p>
          <p className={styles.app}>NFT Marketplace</p>
        </div>

        <div className={styles.right}>
          <ul>
            <li>Terms of Service</li>
            <li>Policy</li>
            <li>WasteBridge &copy; 2021</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer
