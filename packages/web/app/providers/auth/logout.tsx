import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Return logout function which must redirect to specific path
 * @param returnTo path to redirect after logout, must not have origin
 * */
export const useLogout = () => {
  const { logout } = useAuth0();

  return useCallback(() => {
    logout({
      logoutParams: {
        returnTo: window.location.origin, // return to index page
      },
    });
  }, [logout]);
};
