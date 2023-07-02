import { gql } from "@apollo/client";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { GetVaultsQuery, GetVaultsSymbolsQuery } from "../gql/graphql";

const GetVaults = gql`
  query GetVaults {
    vaults(orderBy: name, orderDirection: asc) {
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

const GetVaultsSymbols = gql`
  query GetVaultsSymbols {
    vaults(orderBy: name, orderDirection: asc) {
      symbol
    }
  }
`;

/**
 * Get list of Vaults
 * */
export const useGetVaults = () => {
  const { data, error } = useSuspenseQuery<GetVaultsQuery>(GetVaults);
  return { data, error };
};

/**
 * Get list of symbols of the Vaults
 * */
export const useGetVaultsSymbols = () => {
  const { data, error } =
    useSuspenseQuery<GetVaultsSymbolsQuery>(GetVaultsSymbols);
  return { data, error };
};
