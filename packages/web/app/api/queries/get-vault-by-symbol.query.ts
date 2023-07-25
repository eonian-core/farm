import { ApolloClient, gql } from "@apollo/client";
import { VaultBySymbolQuery } from "../gql/graphql";

export const GetVaultBySymbol = gql`
  query VaultBySymbol($symbol: String!) {
    vaults(where: { symbol: $symbol }) {
      asset {
        address
        name
        symbol
        decimals
        price {
          value
          decimals
        }
      }
      rates(first: 1, where: { side: LENDER }) {
        perBlock
        apy {
          yearly
        }
      }
      address
      name
      symbol
      decimals
      fundAssets
      fundAssetsUSD
    }
  }
`;

/**
 * Get vault by its symbol
 * */
export const getVaultBySymbol = async (client: ApolloClient<any>, symbol: string) => {
  const { data, error } = await client.query<VaultBySymbolQuery>({
    query: GetVaultBySymbol,
    variables: {
      symbol,
    },
  });
  return { data, error };
};
