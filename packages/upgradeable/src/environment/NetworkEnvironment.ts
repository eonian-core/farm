import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export enum NetworkEnvironment {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  STAGING = 'STAGING',
  PRODUCTION = 'PROD',
}

export function resolveNetworkEnvironment(hre: HardhatRuntimeEnvironment): NetworkEnvironment {
  const hardhatNetwork = hre.network.name
  if (hardhatNetwork === 'ganache' || hardhatNetwork === 'hardhat' || hardhatNetwork === 'localhost') {
    return NetworkEnvironment.LOCAL
  }
  const environmentString = hardhatNetwork.split('_').at(-1)
  const environment = Object.values(NetworkEnvironment).find(env => env.toLowerCase() === environmentString)
  if (!environment) {
    throw new Error(`Unable to resolve environment from: ${hardhatNetwork}, got: ${environmentString}!`)
  }
  return environment
}
