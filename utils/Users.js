import { supabase } from './supabaseClient'
import axios from 'axios'

export const getUser = async(user) => {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .match({address: user})

  return data[0]
}

export const getAllsUsers = async() => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')

  return data
}

export const getMetamaskUser = () => {
  return ethereum.selectedAddress;
}