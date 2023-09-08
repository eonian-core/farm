"use client";
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import { useEffect } from 'react';
import { isInBrowser } from '../providers/browser';

export const isAuthEnabled = () => process.env.NEXT_PUBLIC_AUTH0_ENABLED === "true" && isInBrowser();

/** Wraper for authorisation provider, which enables authentication based on environment */
export const AuthProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
  if (!isAuthEnabled()) {
    // ignore authentication locally or in production
    return <>{children}</>;
  }

  console.log('Authentication is enabled');

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.protocol + "//" + window.location.host,
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE!,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthenticateOnOpen>{children}</AuthenticateOnOpen>
    </Auth0Provider>
  );
};


/** Allow open page only for authenticated users */
export const AuthenticateOnOpen = ({ children }: React.PropsWithChildren): JSX.Element => {
  useLoginWhenNotAuthenticated();

  // Imposible to show Loader on (isLoading || !isAuthenticated)
  // it breaks web3 onboarding, and then imposible to connect any wallet

  return <>{children}</>;
}

export const useLoginWhenNotAuthenticated = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {

    if(!isLoading && !isAuthenticated) 
      loginWithRedirect();
    

  }, [isAuthenticated, isLoading, loginWithRedirect])
}
