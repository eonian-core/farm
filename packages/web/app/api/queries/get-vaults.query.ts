import { gql } from "@apollo/client";
import { GetVaultsQuery, GetVaultsSymbolsQuery } from "../gql/graphql";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

const GetVaults = gql`
  query GetVaults {
    vaults {
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

const GetVaultsSymbols = gql`
  query GetVaultsSymbols {
    vaults {
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
