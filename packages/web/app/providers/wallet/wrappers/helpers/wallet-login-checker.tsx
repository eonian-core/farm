import * as ethers from 'ethers'

interface WalletLoginChecker {
  isConnected(): Promise<boolean>
}

export function isLoggedInWallet(label: string): Promise<boolean> {
  let connectionChecker: WalletLoginChecker
  switch (label) {
    case 'MetaMask': {
      connectionChecker = new MetaMaskLoginChecker()
      break
    }
    default: {
      connectionChecker = new DummyLoginChecker()
      break
    }
  }
  return connectionChecker.isConnected()
}

class MetaMaskLoginChecker implements WalletLoginChecker {
  private provider: ethers.BrowserProvider | null = null

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { ethereum } = window
    if (ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.provider = new ethers.BrowserProvider(ethereum)
    }
  }

  isConnected = async (): Promise<boolean> => {
    if (!this.provider) {
      return false
    }

    const accounts = await this.provider.listAccounts()
    return accounts.length > 0
  }
}

class DummyLoginChecker implements WalletLoginChecker {
  isConnected = async (): Promise<boolean> => Promise.resolve(false)
}
