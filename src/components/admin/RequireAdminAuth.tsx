import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../auth/useAuth'
import './AdminAuth.css'

export default function RequireAdminAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <main className="admin-auth-state">Checking your session…</main>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
