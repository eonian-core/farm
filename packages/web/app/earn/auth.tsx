"use client";
import { Auth0Provider } from '@auth0/auth0-react';

/** Wraper for authorisation provider, which enables authentication based on environment */
export const AuthProvider = ({ children }: React.PropsWithChildren) => {
    if(process.env.NEXT_PUBLIC_AUTH0_ENABLED !== "true") {
      // ignore authentication locally or in production
      return children;
    }
  
    return (
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        {children}
      </Auth0Provider>
    );
  }