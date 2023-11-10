import { useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/**
 * Return logout function which must redirect to specific path.
 */
export function useLogout() {
  const { logout } = useAuth0()

  return useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logout({
      logoutParams: {
        returnTo: window.location.origin, // return to index page
      },
    })
  }, [logout])
}
