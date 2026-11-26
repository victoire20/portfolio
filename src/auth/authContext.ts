import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthContextValue = {
  session: Session | null
  loading: boolean
  authError: string | null
  clearAuthError: () => void
  signInWithPassword: (email: string, password: string) => Promise<string | null>
  signInWithGoogle: (returnTo: string) => Promise<string | null>
  signOut: () => Promise<string | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
