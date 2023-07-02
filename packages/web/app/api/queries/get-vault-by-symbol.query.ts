import { gql } from "@apollo/client";
import { VaultBySymbolQuery } from "../gql/graphql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

interface Params {
  symbol: string;
}

const GetVaultBySymbol = gql`
  query VaultBySymbol($symbol: String!) {
    vaults(where: { symbol: $symbol }) {
      asset {
        address
        name
        symbol
        decimals
      }
      rates(first: 1, where: { side: LENDER }) {
        perBlock
      }
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
