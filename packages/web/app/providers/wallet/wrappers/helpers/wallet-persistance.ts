import { ChainId } from './wallet-chain-id'

const WALLET_LOCAL_STORAGE_KEY = '__connected-wallet-label'
const CHAIN_LOCAL_STORAGE_KEY = '__last-active-chain'

class WalletPersistance {
  saveWalletLabel = (walletLabel: string) => {
    localStorage.setItem(WALLET_LOCAL_STORAGE_KEY, walletLabel)
  }

  removeWalletlabel = () => {
    localStorage.removeItem(WALLET_LOCAL_STORAGE_KEY)
  }

  getWalletLabel = (): string | null => localStorage.getItem(WALLET_LOCAL_STORAGE_KEY)

  saveLastActiveChain = (chainId: ChainId) => {
    localStorage.setItem(CHAIN_LOCAL_STORAGE_KEY, chainId.toString())
  }

  removeLastActiveChain = () => {
    localStorage.removeItem(CHAIN_LOCAL_STORAGE_KEY)
  }

  getLastActiveChain = (): ChainId => {
    const chainId = localStorage.getItem(CHAIN_LOCAL_STORAGE_KEY)
    return chainId ? ChainId.parse(chainId) : ChainId.UNKNOWN
  }
}

const singleton = new WalletPersistance()

export default singleton
