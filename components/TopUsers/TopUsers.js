import { useEffect, useState } from 'react'
import { getAllsUsers } from '../../utils/Users'
import User from './User'
import styles from './TopUsers.module.scss'

const TopUsers = () => {
  const [users, setUsers] = useState()
  
  useEffect(async() => {
    setUsers(await getAllsUsers())
    console.log(await getAllsUsers())
  }, [])

  return (
    <div className={styles.topUsers}>
      <div className={styles.header}>
        <p className={styles.title}>Hot Users ⚡</p>
      </div>

      <div className={styles.usersList}>
        {users && users.slice(0, 20).map((user, index) => (
          <User
            user={user}
            index={index}
            key={index} />
          ))}
      </div>
    </div>
  )
}

export default TopUsers
