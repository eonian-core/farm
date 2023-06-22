import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { mockTokenContract } from "./mock-token";
import { defaultAddress, mockViewFunction } from "./mocking";

export const vaultAddress = defaultAddress.toHexString()

export const tokenAddress = Address.fromString("0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
export const tokenAddressStr = tokenAddress.toHexString()

export function mockVaultContract(vault: Address): void {
  // Mock the contract call for getting the name
  mockViewFunction(vault, "name", "string", [ethereum.Value.fromString("USDT Vault")])
  // Mock the contract call for getting the symbol
  mockViewFunction(vault, "symbol", "string", [ethereum.Value.fromString("eonUSDT")])
  // Mock the contract call for getting the version
  mockViewFunction(vault, "version", "string", [ethereum.Value.fromString("0.1.0")])
  // Mock the contract call for getting the decimals
  mockViewFunction(vault, "decimals", "uint8", [ethereum.Value.fromI32(18)])
  // Mock the contract call for getting the totalSupply
  mockViewFunction(vault, "totalSupply", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('100000000000000000000'))])
  // Mock the contract call for getting the totalDebt
  mockViewFunction(vault, "totalDebt", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromString('50000000000000000000'))])
  // Mock the contract call for getting the MAX_BPS
  mockViewFunction(vault, "MAX_BPS", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(10000))])
  // Mock the contract call for getting the debtRatio
  mockViewFunction(vault, "debtRatio", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(5000))])
  // Mock the contract call for getting the lastReportTimestamp
  mockViewFunction(vault, "lastReportTimestamp", "uint256", [ethereum.Value.fromSignedBigInt(BigInt.fromI64(123))])
  // Mock the contract call for getting the asset
  mockViewFunction(vault, "asset", "address", [ethereum.Value.fromAddress(tokenAddress)])
  
  mockTokenContract(tokenAddress)
}