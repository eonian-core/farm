import { gql } from "@apollo/client";
import { query } from "../apollo.client";
import { VaultBySymbolQuery } from "../gql/graphql";

interface Params {
  symbol: string;
  revalidate?: number;
}

const GetVaultBySymbol = gql`
  query VaultBySymbol($symbol: String!) {
    vaultBySymbol(symbol: $symbol) {
      underlyingAsset {
        address
        name
        symbol
        decimals
      }
      totalBalance
      interestRate
      lastHarvestTime
      address
      name
      symbol
      decimals
    }
  }
`;

/**
 * Get vault by its symbol
 * @example getVaultBySymbol().then(console.log)
 * */
export const getVaultBySymbol = (params: Params) => {
  const { symbol, revalidate = 60 } = params;
  return query<VaultBySymbolQuery>({
    query: GetVaultBySymbol,
    variables: {
      symbol,
    },
    context: {
      fetchOptions: {
        next: { revalidate },
      },
    },
  });
};
