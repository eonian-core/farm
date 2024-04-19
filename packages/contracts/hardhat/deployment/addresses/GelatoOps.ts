import { Chain } from '../../types'
import type { LookupMap } from './BaseAddresses'
import { BaseAddresses } from './BaseAddresses'

// More contract addresses at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses
export class GelatoOps extends BaseAddresses {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
      },
    }
  }
}
