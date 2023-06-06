import { gql } from "@apollo/client";
import { VaultBySymbolQuery } from "../gql/graphql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

interface Params {
  symbol: string;
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
 * */
export const useGetVaultBySymbol = (params: Params) => {
  const { symbol } = params;
  const { data, error } = useSuspenseQuery<VaultBySymbolQuery>(
    GetVaultBySymbol,
    {
      variables: {
        symbol,
      },
    }
  );
  return { data, error };
};
