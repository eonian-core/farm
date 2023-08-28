import VaultABI from '../abi/Vault.json'
import ERC20ABI from '../abi/ERC20.json'
import type { MulticallRequest } from './multicall'

export function createVaultRequest(address: string, functionName: string, args: any[] = []): MulticallRequest {
  return {
    address,
    abi: VaultABI,
    functionName,
    args,
  }
}

export function createERC20Request(address: string, functionName: string, args: any[] = []): MulticallRequest {
  return {
    address,
    abi: ERC20ABI,
    functionName,
    args,
  }
}
