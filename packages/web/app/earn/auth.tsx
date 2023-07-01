"use client";
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Loading from './loading';
import { useEffect } from 'react';

/** Wraper for authorisation provider, which enables authentication based on environment */
export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  if (process.env.NEXT_PUBLIC_AUTH0_ENABLED !== "true") {
    // ignore authentication locally or in production
    return children;
  }

  console.log('Authentication is enabled');

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <AuthenticateOnOpen>
        {children}
      </AuthenticateOnOpen>
    </Auth0Provider>
  );
};


/** Allow open page only for authenticated users */
export const AuthenticateOnOpen = ({ children }: React.PropsWithChildren) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  console.log("user, isAuthenticated, isLoading", user, isAuthenticated, isLoading)

  useEffect(() => {

    if(!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }

  }, [isAuthenticated, isLoading, loginWithRedirect])

  if(isLoading || !isAuthenticated) {
    return <Loading />
  }

  return children;
}