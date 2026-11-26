import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth'
import { clearStoredAdminRedirect, getStoredAdminRedirect } from '../../utils/adminRedirect'

export default function AdminAuthRedirect() {
  const { session, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || !session || location.pathname !== '/') return
    const destination = getStoredAdminRedirect()
    if (!destination) return
    clearStoredAdminRedirect()
    navigate(destination, { replace: true })
  }, [loading, location.pathname, navigate, session])

  return null
}
