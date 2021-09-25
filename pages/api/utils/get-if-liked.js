import { supabase } from '../../../utils/supabaseClient'

export default async function handler(req, res) {
  const { address, nft } = req.body

  console.log(address, nft)

  const userData = await supabase
    .from('profiles')
    .select('*')
    .match({address: address})

  let user = userData.data[0]

  const { data, error } = await supabase
    .from('likes')
    .select()
    .match({user_id: user.id, nft_id: nft.id})

  console.log({likes: nft.likes, liked: data.length == 0 ? false : true})

  res.status(200).json({likes: nft.likes, liked: data.length == 0 ? false : true})
}
