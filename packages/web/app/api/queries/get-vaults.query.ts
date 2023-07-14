import { ApolloClient, gql } from "@apollo/client";

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
export const getVaults = async (client: ApolloClient<any>) => {
  const { data, error } = await client.query<GetVaultsQuery>({
    query: GetVaults,
  });
  return { data, error };
};


/**
 * Get list of symbols of the Vaults
 * */
export const getVaultsSymbols = async (client: ApolloClient<any>) => {
  const { data, error } = await client.query<GetVaultsSymbolsQuery>({
    query: GetVaultsSymbols,
  });
  return { data, error };
};
