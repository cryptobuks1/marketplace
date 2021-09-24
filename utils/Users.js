import { supabase } from './supabaseClient'

export const getUser = async(address) => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .match({address})
  
  return data[0]
}

export const getMetamaskUser = () => {
  return ethereum.selectedAddress;
}