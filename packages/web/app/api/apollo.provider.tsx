"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  SuspenseCache,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ChainId } from "../providers/wallet/wrappers/helpers";
import { defaultChain } from "../web3-onboard";
import { getGraphQLEndpoint } from "./endpoints";

function makeClient() {
  // TODO: Remove this logic. Temporarily (for alpha test) we use only one default API endpoint, 
  // then we will need to select a URL depending on user choice
  const chainId = ChainId.parse(defaultChain.id);
  const httpLink = new HttpLink({
    uri: getGraphQLEndpoint(chainId),
  });

  return new ApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

function makeSuspenseCache() {
  return new SuspenseCache();
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
      makeSuspenseCache={makeSuspenseCache}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
