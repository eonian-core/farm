import { gql } from '@apollo/client';
import { query } from './apollo.client';
import {GetVaultsQuery} from './gql/graphql';

export const GetVaults = gql`
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

/** Get list of Vaults */
export const getVaults = () => query<GetVaultsQuery>({ query: GetVaults })

// usage getVaults().then(console.log)