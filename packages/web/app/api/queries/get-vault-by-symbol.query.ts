import { gql } from "@apollo/client";
import { VaultBySymbolQuery } from "../gql/graphql";
import { query } from "../apollo.client";
import { use } from "react";

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
  const { data, error } = use(
    query<VaultBySymbolQuery>({
      query: GetVaultBySymbol,
      variables: {
        symbol,
      },
    })
  );
  return { data, error };
};
