import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { ChainId } from "../providers/wallet/wrappers/helpers";
import { getGraphQLEndpoint } from "./endpoints";

const makeClientFactory = (chainId: ChainId) => () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getGraphQLEndpoint(chainId),
    }),
  });
};

const registerClient = (chainId: ChainId) => {
  const clientMaker = makeClientFactory(chainId);
  return registerApolloClient(clientMaker).getClient;
};

const clientGetters: Record<
  Exclude<ChainId, ChainId.UNKNOWN>,
  ReturnType<typeof registerApolloClient>["getClient"]
> = {
  [ChainId.BSC_MAINNET]: registerClient(ChainId.BSC_MAINNET),
  [ChainId.SEPOLIA]: registerClient(ChainId.SEPOLIA),
};

export const getClient = (chainId: Exclude<ChainId, ChainId.UNKNOWN>) =>
  clientGetters[chainId]();
