import { supabase } from './supabaseClient'
import axios from 'axios'

export const getUser = async() => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .match({address: ethereum.selectedAddress})

  return data[0]
}

export const getMetamaskUser = () => {
  return ethereum.selectedAddress;
}