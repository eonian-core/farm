import * as ethers from "ethers";

interface WalletLoginChecker {
  isConnected(): Promise<boolean>;
}

export default function isLoggedInWallet(label: string): Promise<boolean> {
  let connectionChecker: WalletLoginChecker;
  switch (label) {
    case "MetaMask": {
        connectionChecker = new MetaMaskLoginChecker();
        break;
    }
    default: {
        connectionChecker = new DummyLoginChecker();
        break;
    }
  }
  return connectionChecker.isConnected();
}

class MetaMaskLoginChecker implements WalletLoginChecker {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor() {
    const { ethereum } = window;
    if (ethereum) {
      this.provider = new ethers.providers.Web3Provider(ethereum);
    }
  }

  isConnected = async (): Promise<boolean> => {
    if (!this.provider) {
      return false;
    }
    const accounts = await this.provider.listAccounts();
    return accounts.length > 0;
  };
}

class DummyLoginChecker implements WalletLoginChecker {
  isConnected = async (): Promise<boolean> => Promise.resolve(true);
}
