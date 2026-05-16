import { supabase } from './supabase'

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const checkUsernameUnique = async (username: string) => {
  // Use a head-only request to check for existence efficiently
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username)
  
  if (error) {
    console.error('Supabase error checking username:', error)
    // If we can't check, we should probably throw so the UI can show the error state
    throw error
  }
  
  // If count is 0, the username is unique
  return count === 0
}
