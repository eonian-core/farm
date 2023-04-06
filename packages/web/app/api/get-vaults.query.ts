import { gql } from '@apollo/client';
import { query } from './apollo.client';

export const GetVaultsQuery = gql`
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
export const getVaults = () => query({ query: GetVaultsQuery })

// usage getVaults().then(console.log)