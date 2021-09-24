import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { create } from 'ipfs-http-client';
import styles from './address.module.scss'

const address = ({address, SUPABASE_URL, SUPABASE_KEY, IPFS_ID, IPFS_SECRET}) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const [loadData, setLoadData] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState('')
  const [fileErrorMessage, setFileErrorMessage] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [profileIMG, setProfileIMG] = useState('')

  const getData = async() => {
    ethereum.selectedAddress != address && window.open('/', '_self')

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .match({address})

    const { name, username, bio, headerImage, profileImage, instagram, twitter } = data[0]
    setName(name)
    setUsername(username)
    setBio(bio)
    setProfileIMG(profileImage)

    setLoadData(true)
  }

  const updateData = async() => {
    setUpdateLoading(true)

    await supabase
      .from('profiles')
      .update({
        name: name,
        username: username,
        bio: bio,
        profileImage: await uploadProfileImage()
      })
      .match({address})

    setUpdateLoading(false)
  }

  const onFileChange = event => {
    if(event.target.files[0].size > 10485760) {
      setFileErrorMessage(true)
      setSelectedFile('')
    } else {
      setFileErrorMessage(false)
      setSelectedFile(event.target.files[0])
    }
  }

  const uploadProfileImage = async() => {
    // Infura IPFS Authentication
    const projectId = IPFS_ID
    const projectSecret = IPFS_SECRET
    const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
    
    // Create IPFS Client
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    })

    // Add and Pin Image to the Project's Infura account
    const added = await client.add(selectedFile, {
      pin: true
    })
    // Create Image URL
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    return url
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles.address}>
      {loadData &&
      <>
        {profileIMG ?
          <div className={styles.imgPreview} style={{backgroundImage: `url(${profileIMG})`}}>
            <i className='far fa-times' onClick={() => setProfileIMG(null)}></i>
          </div>
        :
          !selectedFile ?
            <>
              <div className={styles.fileField}>
                <p className={styles.supportedFiles}>PNG, GIF, JPG (Max 10MB)</p>

                <label htmlFor='file-upload'>
                  <i className='fad fa-file'></i> 
                  <p>Upload File</p>
                </label>
                <input id='file-upload' type='file' accept='image/*' className={styles.fileUpload} value={selectedFile} onChange={onFileChange} />
              </div>

              {fileErrorMessage &&
                <div className={styles.fileErrorMessage}>
                  <p>File size too big. Max size is 10 MB.</p>
                  <i className='fas fa-times' onClick={() => setFileErrorMessage(false)}></i>
                </div>}
            </>
          :
            <div className={styles.imgPreview} style={{backgroundImage: `url(${URL.createObjectURL(selectedFile)})`}}>
              <i className='far fa-times' onClick={() => setSelectedFile(null)}></i>
            </div>
        }

        <div className={styles.inputField}>
          <p className={styles.header}>Name</p>
          <input type='text' value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className={styles.inputField}>
          <p className={styles.header}>Username</p>
          <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div className={styles.inputField}>
          <p className={styles.header}>Bio</p>
          <textarea type='text' value={bio} onChange={e => setBio(e.target.value)} />
        </div>

        <div className={styles.updateBTN} onClick={updateData}>
          {!updateLoading ?
            <i className='fad fa-upload'></i>
            :
            <i className={`far fa-spinner-third ${styles.spinner}`}></i>
          }
          <p>Update Profile</p>
        </div>
      </>}
    </div>
  )
}

export default address

export async function getServerSideProps(ctx) {
  const { address } = ctx.query
  const { SUPABASE_URL, SUPABASE_KEY, IPFS_ID, IPFS_SECRET } = process.env

  return {
    props: {
      address, SUPABASE_URL, SUPABASE_KEY, IPFS_ID, IPFS_SECRET
    }
  }
}