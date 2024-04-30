import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { expect } from 'chai'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../NetworkEnvironment'

describe(resolveNetworkEnvironment.name, () => {
  it('Should resolve chain from network name', () => {
    const given = [
      'bsc_mainnet_local',
      'bsc_mainnet_dev',
      'bsc_mainnet_staging',
      'bsc_mainnet_prod',
    ]
    const expected = [
      NetworkEnvironment.LOCAL,
      NetworkEnvironment.DEV,
      NetworkEnvironment.STAGING,
      NetworkEnvironment.PRODUCTION,
    ]
    for (let i = 0; i < given.length; i++) {
      const result = resolveNetworkEnvironment({
        network: {
          name: given[i],
        },
      } as HardhatRuntimeEnvironment)
      expect(result).to.be.equal(expected[i])
    }
  })
})
