import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthContext } from './authContext'
import {
  clearStoredAdminRedirect,
  storeAdminRedirect,
} from '../utils/adminRedirect'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected authentication error occurred.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = () => {}

    async function initializeAuth() {
      const { supabase } = await import('../utils/supabase')
      if (!isMounted) return
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!isMounted) return
        setSession(nextSession)
        setAuthError(null)
      })
      unsubscribe = () => subscription.unsubscribe()

      const { data, error } = await supabase.auth.getSession()
      if (!isMounted) return
      if (error) setAuthError(error.message)
      else setSession(data.session)
      setLoading(false)
    }

    initializeAuth().catch((error: unknown) => {
      if (!isMounted) return
      setAuthError(getErrorMessage(error))
      setLoading(false)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  async function signInWithPassword(email: string, password: string) {
    setAuthError(null)
    try {
      const { supabase } = await import('../utils/supabase')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return error?.message ?? null
    } catch (error) {
      return getErrorMessage(error)
    }
  }

  async function signInWithGoogle(returnTo: string) {
    setAuthError(null)
    const storageError = storeAdminRedirect(returnTo)
    if (storageError) return storageError
    try {
      const { supabase } = await import('../utils/supabase')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: new URL('/admin/auth/callback', window.location.origin).toString() },
      })
      if (error) clearStoredAdminRedirect()
      return error?.message ?? null
    } catch (error) {
      clearStoredAdminRedirect()
      return getErrorMessage(error)
    }
  }

  async function signOut() {
    try {
      const { supabase } = await import('../utils/supabase')
      const { error } = await supabase.auth.signOut()
      return error?.message ?? null
    } catch (error) {
      return getErrorMessage(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        signInWithPassword,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
