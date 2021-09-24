import { getStartOfWeek } from './Misc';
import { supabase } from './supabaseClient'

// get the nfts a profile holds
export const getProfileNFTs = async(addressFromQuery) => {
  const { data, error } = await supabase
    .from('json')
    .select()
    .match({holder: addressFromQuery})

  return data;
}

// get the trending NFTs
export const getTrendingNFTs = async() => {
  const { data, error } = await supabase
    .from('json')
    .select()
    .match({weekStart: getStartOfWeek(new Date())})

    return data.sort((a,b) => (a.likes7Days < b.likes7Days) ? 1 : ((b.likes7Days > a.likes7Days) ? -1 : 0))
}