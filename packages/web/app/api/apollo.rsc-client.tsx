import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { ChainId } from '../providers/wallet/wrappers/helpers';
import { getGraphQLEndpoint } from './endpoints';
import { scalarTypePolicies } from './gql/graphql';

const makeClientFactory = (chainId: ChainId) => () =>
  new ApolloClient({
    cache: new InMemoryCache({ typePolicies: scalarTypePolicies }),
    link: new HttpLink({
      uri: getGraphQLEndpoint(chainId),
    }),
  });

const registerClient = (chainId: ChainId) => {
  const clientMaker = makeClientFactory(chainId);
  return registerApolloClient(clientMaker).getClient;
};

const clientGetters: Record<Exclude<ChainId, ChainId.UNKNOWN>, ReturnType<typeof registerApolloClient>['getClient']> = {
  [ChainId.BSC_MAINNET]: registerClient(ChainId.BSC_MAINNET),
  [ChainId.SEPOLIA]: registerClient(ChainId.SEPOLIA),
};

export const getClient = (chainId: ChainId) => {
  if (chainId === ChainId.UNKNOWN) {
    throw new Error('Unknown chain id');
  }

  return clientGetters[chainId]();
};
