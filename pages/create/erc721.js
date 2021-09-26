import Web3 from 'web3'
import { useState } from 'react'
import styles from './erc721.module.scss'
import { createClient } from '@supabase/supabase-js'
const abi = require('../../contracts/abis/NFT.json')
import { create } from 'ipfs-http-client';

const erc721 = ({ SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, IPFS_ID, IPFS_SECRET }) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [selectedFile, setSelectedFile] = useState('')
  const [fileErrorMessage, setFileErrorMessage] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const onFileChange = event => {
    if(event.target.files[0].size > 10485760) {
      setFileErrorMessage(true)
      setSelectedFile('')
    } else {
      setFileErrorMessage(false)
      setSelectedFile(event.target.files[0])
    }
  }

  const mintNFT = async() => {
    setMintLoading(true)

    const address = ethereum.selectedAddress
    const uri = `${address.slice(2, 7)}${address.slice(37, 42)}-${Date.now()}`

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
    
    // Get Contract and Mint NFT
    const web3 = new Web3(ethereum)
    const contract = new web3.eth.Contract(abi, NFT_CONTRACT)
    let response = await contract.methods.mintNFT(price, uri).send({from: address})
    console.log(response) 

    // Insert data to Supabase json Table
    const { dbData, dbError } = await supabase
    .from('json')
    .insert({
      uri: uri,
      tokenID: response.events.Transfer.returnValues.tokenId,
      owner: address,
      holder: address,
      price: price,
      data: {
        name,
        description,
        image: url
      },
      isListed: true
    })

    setMintLoading(false)

    window.open('/', '_self')
  }

  return (
    <div className={styles.erc721}>
      {!selectedFile ? 
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
        <div className={styles.imgPreview}>
          <img src={URL.createObjectURL(selectedFile)} />
          <i className='far fa-times' onClick={() => setSelectedFile(null)}></i>
        </div>
      }

      <div className={styles.inputField}>
        <p className={styles.header}>Name</p>
        <input type='text' placeholder='My awesome NFT' value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className={styles.inputField}>
        <p className={styles.header}>Description</p>
        <textarea type='text' placeholder='This is my awesome NFT being sold on the WasteBridge Marketplace!' value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className={styles.inputField}>
        <p className={styles.header}>Price</p>
        <input type='number' placeholder='0' value={price} onChange={e => setPrice(e.target.value)} />
      </div>

      <div className={styles.disclaimer}>
        <div>
          <p>Service Fee</p>
          <p>2%</p>
        </div>
        <div>
          <p>You will recieve</p>
          <p>{price == null ? 0 :  price * (98/100)} BNB</p>
        </div>
      </div>

      <div className={styles.mintBTN} onClick={mintNFT}>
        {!mintLoading ?
          <i className='fad fa-layer-plus'></i>
          :
          <i className={`far fa-spinner-third ${styles.spinner}`}></i>
        }
        <p>Mint NFT</p>
      </div>
    </div>
  )
}

export default erc721

export async function getServerSideProps(context) {
  const { SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, IPFS_ID, IPFS_SECRET } = process.env

  return {
    props: { SUPABASE_URL, SUPABASE_KEY, NFT_CONTRACT, IPFS_ID, IPFS_SECRET }
  }
}