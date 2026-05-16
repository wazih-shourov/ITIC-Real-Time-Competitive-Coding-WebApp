import { useEffect } from 'react'
import { supabase } from '@lib/supabase'
import { useAuthStore } from '@store/useAuthStore'
import { getProfile } from '@lib/profile'

export const useAuthManager = () => {
  const { setAuth, setProfile, setLoading, setInitialized } = useAuthStore()

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session && mounted) {
          setAuth(session, session.user)
          // Fetch profile in background without blocking initialization
          getProfile(session.user.id)
            .then(profile => {
              if (mounted) setProfile(profile)
            })
            .catch(err => {
              console.warn('Silent profile fetch error:', err)
            })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setAuth(session, session.user)
          getProfile(session.user.id)
            .then(profile => {
              if (mounted) setProfile(profile)
            })
            .catch(err => console.warn('Silent profile fetch error on auth change:', err))
        }
      } else if (event === 'SIGNED_OUT') {
        setAuth(null, null)
        setProfile(null)
      }
      
      setLoading(false)
      setInitialized(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuth, setProfile, setLoading, setInitialized])
}
