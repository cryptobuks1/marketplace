import { supabase } from './supabaseClient'
import { getStartOfWeek } from './Misc'

export const likeNFT = async(nft, user, setLiked, likeCount, setLikeCount) => {
  if(user) {
    // cooking the 7 day score
    const { data, error } = await supabase
      .from('json')
      .select()
      .match({uri: nft.uri})

    let weekStart = data[0].weekStart
    let likes7Days = data[0].likes7Days
    const startOfWeek = getStartOfWeek(new Date())
    const likesDatesComparison = startOfWeek.localeCompare(weekStart)
    if(likesDatesComparison == 1) {
      likes7Days = 0
      weekStart = startOfWeek
    }

    // insert user and nft liked
    await supabase
      .from('likes')
      .insert([
        {user_id: user.id, nft_id: nft.id}
      ])

    // increase nft like count
    await supabase
      .from('json')
      .update({
        likes: likeCount + 1, 
        weekStart: weekStart,
        likes7Days: likes7Days + 1
      })
      .match({uri: nft.uri})

    setLiked(true)
    setLikeCount(likeCount + 1)
  } else console.log('user not signed in')
}

export const unlikeNFT = async(nft, user, setLiked, likeCount, setLikeCount) => {
  if(user) { // checking just in case
    const { data, error } = await supabase
      .from('json')
      .select()
      .match({uri: nft.uri})

    let weekStart = data[0].weekStart
    let likes7Days = data[0].likes7Days
    const startOfWeek = getStartOfWeek(new Date())
    const likesDatesComparison = startOfWeek.localeCompare(weekStart)
    if(likesDatesComparison == 0) {
      await supabase
        .from('json')
        .update({
          likes: likeCount - 1,
          likes7Days: likes7Days - 1
        })
        .match({uri: nft.uri})
    } else {
      await supabase
        .from('json')
        .update({
          likes: likeCount - 1,
        })
        .match({uri: nft.uri})
    }

    await supabase
      .from('likes')
      .delete()
      .match({user_id: user.id, nft_id: nft.id})

    
    setLiked(false)
    setLikeCount(likeCount - 1)
  } else console.log('user not signed in')
}

export const getIfNFTLiked = async(nft, user, setLiked, setLikeCount) => {
  if(user) {
    const {data, error} = await supabase
      .from('likes')
      .select()
      .match({user_id: user.id, nft_id: nft.id})
    
    data.length == 0 ? setLiked(false) : setLiked(true)
  } else setLiked(false)

  setLikeCount(nft.likes)
}