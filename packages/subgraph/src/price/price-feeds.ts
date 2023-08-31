import { Address, TypedMap } from '@graphprotocol/graph-ts'

export const BNB_ADDRESSES = new TypedMap<string, Address>()
BNB_ADDRESSES.set(
  'USDT',
  Address.fromString('0xB97Ad0E74fa7d920791E90258A6E2085088b4320'),
)
BNB_ADDRESSES.set(
  'BUSD',
  Address.fromString('0xcBb98864Ef56E9042e7d2efef76141f15731B82f'),
)
BNB_ADDRESSES.set(
  'USDC',
  Address.fromString('0x51597f405303C4377E36123cBc172b13269EA163'),
)

const SEPOLIA_ADDRESSES = new TypedMap<string, Address>()
SEPOLIA_ADDRESSES.set(
  'USDT',
  // There is no "USDT/USD" price feed for Sepolia testnet, we can use "USDC" one for testing purposes.
  Address.fromString('0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E'),
)

export function getPriceFeedAddress(
  symbol: string,
  network: string,
): Address | null {
  // eslint-disable-next-line eqeqeq
  if (network == 'bsc') {
    return BNB_ADDRESSES.get(symbol)
  }
  // eslint-disable-next-line eqeqeq
  else if (network == 'sepolia') {
    return SEPOLIA_ADDRESSES.get(symbol)
  }
  return null
}
