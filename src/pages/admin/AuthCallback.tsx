import { useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import useAuth from '../../auth/useAuth'
import { clearStoredAdminRedirect, getStoredAdminRedirect } from '../../utils/adminRedirect'
import '../../components/admin/AdminAuth.css'

export default function AuthCallback() {
  const { session, loading, authError } = useAuth()
  const [searchParams] = useSearchParams()
  const returnTo = getStoredAdminRedirect() ?? '/admin'
  const providerError = searchParams.get('error_description') ?? searchParams.get('error')
  const errorMessage = providerError ?? authError

  useEffect(() => {
    if (session || providerError) clearStoredAdminRedirect()
  }, [providerError, session])

  if (loading) {
    return <main className="admin-auth-state">Completing sign-in…</main>
  }

  if (session) {
    return <Navigate to={returnTo} replace />
  }

  return (
    <main className="admin-auth-state">
      <section>
        <h1>Unable to sign in</h1>
        <p>{errorMessage ?? 'No active session was returned by the authentication provider.'}</p>
        <Link to="/admin/login">Return to login</Link>
      </section>
    </main>
  )
}
