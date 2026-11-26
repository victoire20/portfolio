const ADMIN_RETURN_TO_KEY = 'portfolio-admin-return-to'

export function getSafeAdminRedirect(path: string | null | undefined) {
  if (!path) return '/admin'

  try {
    const destination = new URL(path, window.location.origin)
    const isAdminPath = destination.pathname === '/admin' || destination.pathname.startsWith('/admin/')
    const isAuthPath = destination.pathname === '/admin/login'
      || destination.pathname === '/admin/auth/callback'

    if (destination.origin !== window.location.origin || !isAdminPath || isAuthPath) {
      return '/admin'
    }

    return `${destination.pathname}${destination.search}${destination.hash}`
  } catch {
    return '/admin'
  }
}

export function storeAdminRedirect(path: string) {
  try {
    sessionStorage.setItem(ADMIN_RETURN_TO_KEY, getSafeAdminRedirect(path))
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Unable to save the admin redirect destination.'
  }
}

export function getStoredAdminRedirect() {
  try {
    const path = sessionStorage.getItem(ADMIN_RETURN_TO_KEY)
    return path ? getSafeAdminRedirect(path) : null
  } catch {
    return null
  }
}

export function clearStoredAdminRedirect() {
  try {
    sessionStorage.removeItem(ADMIN_RETURN_TO_KEY)
  } catch {
    return
  }
}
