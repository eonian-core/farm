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

export type {GetVaultsQuery}

/** 
 * Get list of Vaults 
 * @example getVaults().then(console.log)
 * */
export const getVaults = () => query<GetVaultsQuery>({ query: GetVaults })
