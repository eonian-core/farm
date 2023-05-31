import { gql } from "@apollo/client";
import { query } from "../apollo.client";
import { GetVaultsQuery } from "../gql/graphql";

interface Params {
  symbols?: boolean;
  revalidate?: number;
}

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
  query GetVaults {
    vaults {
      symbol
    }
  }
`;

/**
 * Get list of Vaults
 * @example getVaults().then(console.log)
 * */
export const getVaults = (params: Params = {}) => {
  const { symbols, revalidate = 60 } = params;
  return query<GetVaultsQuery>({
    query: symbols ? GetVaultsSymbols : GetVaults,
    context: {
      fetchOptions: {
        next: { revalidate },
      },
    },
  });
};
