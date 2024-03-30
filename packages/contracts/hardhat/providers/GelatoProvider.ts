import { Chain } from '../types'
import type { LookupMap } from './BaseProvider'
import { BaseProvider } from './BaseProvider'

// More contract addresses at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses
export class GelatoProvider extends BaseProvider {
  protected getLookupMap(): LookupMap {
    return {
      [Chain.BSC]: {
        ANY_ENVIRONMENT: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
      },
    }
  }
}
