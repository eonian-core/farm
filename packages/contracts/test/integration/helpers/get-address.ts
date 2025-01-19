import hre from 'hardhat'
import type { ContractName } from 'hardhat/types'
import type { TokenSymbol } from '@eonian/upgradeable'
import { Addresses } from '../../../hardhat/deployment'

export async function getAddress(source: ContractName | Addresses, token?: TokenSymbol) {
  const isPartOfAddresses = isInAddresses(source)
  if (isPartOfAddresses) {
    try {
      if (!token) {
        return await hre.addresses.get(source)
      }
      return await hre.addresses.getForToken(source, token)
    }
    catch (_e) {
      try {
        return await hre.addresses.get(source)
      }
      catch (_e) {
        // Ignore
      }
    }
  }
  else if (token) {
    const address = await hre.proxyRegister.getProxyAddress(source, token)
    if (address) {
      return address
    }
  }
  throw new Error(`No address found for: ${source} (token: ${token || '-'})`)
}

function isInAddresses(value: string): value is Addresses {
  return Object.values(Addresses).includes(value as Addresses)
}
