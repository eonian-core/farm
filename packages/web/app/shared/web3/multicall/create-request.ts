import { MulticallRequest } from "./multicall";

import VaultABI from "../abi/Vault.json";
import ERC20ABI from "../abi/ERC20.json";

export function createVaultRequest(
  address: string,
  functionName: string,
  args: any[] = []
): MulticallRequest {
  return {
    address: address,
    abi: VaultABI,
    functionName,
    args,
  };
}

export function createERC20Request(
  address: string,
  functionName: string,
  args: any[] = []
): MulticallRequest {
  return {
    address: address,
    abi: ERC20ABI,
    functionName,
    args,
  };
}
