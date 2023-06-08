import IconBNB from "../../../components/icons/icon-bnb";
import IconWarning from "../../../components/icons/icon-warning";
import isLoggedInWallet from "./helpers/wallet-login-checker";

export enum WalletStatus {
  NOT_CONNECTED = "NOT_CONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
}

export interface Chain {
  id: string;
  name?: string;
  icon: React.ReactNode;
  isDefault: boolean;
  isSupported: boolean;
}

export interface Wallet {
  label: string;
  address: string;
  iconImageSrc: string;
}

const WALLET_LOCAL_STORAGE_KEY = "__connected-wallet-label";
const CHAIN_LOCAL_STORAGE_KEY = "__last-active-chain";

/**
 * Base class for the wallet implementation
 */
export abstract class WalletWrapper {
  protected readonly iconSize: number = 20;

  private _cache: Record<string, any> = {};

  constructor() {
    this.reset();
  }

  protected abstract getWallet: () => Wallet | null;
  protected abstract getCurrentChain: () => Chain | null;
  protected abstract getAvailableChains: () => Chain[];
  protected abstract getStatus: () => WalletStatus;
  protected abstract connectInternal: () => Promise<string | null>;
  protected abstract reconnectInternal: (walletLabel: string) => Promise<void>;
  protected abstract disconnectInternal: () => Promise<void>;
  protected abstract setCurrentChainInternal: (
    chainId: string
  ) => Promise<boolean>;

  /**
   * Clears the cache. Must be called at every initialization.
   */
  protected reset = () => {
    this._cache = {};
  };

  /**
   * Returns the object of the currently connected wallet.
   */
  public get wallet(): Wallet | null {
    return this.cache(this.getWallet, "wallet");
  }

  /**
   * Returns the object of the currently selected chain.
   */
  public get chain(): Chain | null {
    return this.cache(this.getCurrentChain, "chain");
  }

  /**
   * Returns the object of the default (fallback) chain.
   */
  public get defaultChain(): Chain {
    return this.cache(this.getDefaultChain, "defaultChain");
  }

  /**
   * Returns the array of the available networks (chains).
   */
  public get chains(): Chain[] {
    return this.cache(this.getAvailableChains, "chains");
  }

  /**
   * Returns the connection status of the wallet.
   */
  public get status(): WalletStatus {
    return this.cache(this.getStatus, "status");
  }

  /**
   * Initiates connection to the wallet.
   */
  public connect = async (): Promise<void> => {
    const walletLabel = await this.connectInternal();
    if (walletLabel) {
      localStorage.setItem(WALLET_LOCAL_STORAGE_KEY, walletLabel);
    }

    // Connect to the last active chain or fallback to the default one.
    await this.autoSelectProperChain();
  };

  /**
   * Disconnects from the currently connected wallet.
   */
  public disconnect = async (): Promise<void> => {
    await this.disconnectInternal();
    localStorage.removeItem(WALLET_LOCAL_STORAGE_KEY);
  };

  /**
   * Performs reconnection to the last connected wallet (e.g. after a page reload).
   * Reconnection is performed only if the user is logged into the wallet.
   */
  public reconnect = async (): Promise<void> => {
    // Do not reconnect if there is no information about the last connected wallet or if the wallet is already connected.
    const walletLabel = localStorage.getItem(WALLET_LOCAL_STORAGE_KEY);
    if (!walletLabel || this.wallet) {
      return;
    }

    // Do not try to connect to the wallet if the user is not logged in.
    const isLoggedIn = await isLoggedInWallet(walletLabel);
    if (!isLoggedIn) {
      return;
    }

    await this.reconnectInternal(walletLabel);
  };

  /**
   * Sets the active network.
   * @param chainId The identifier of the network you want to connect to.
   */
  public setCurrentChain = async (chainId: string): Promise<void> => {
    const success = await this.setCurrentChainInternal(chainId);
    if (success) {
      localStorage.setItem(CHAIN_LOCAL_STORAGE_KEY, chainId);
    }
  };

  /**
   * Changes the current active chain if necessary.
   * Selects the last active network or fallbacks to the default value.
   * @returns "True" if the chain was successfully changed.
   */
  protected async autoSelectProperChain() {
    // Skip if the current active chain is supported.
    if (this.chain?.isSupported) {
      return;
    }
    const lastActiveChainId = localStorage.getItem(CHAIN_LOCAL_STORAGE_KEY);
    const chainId = lastActiveChainId || this.defaultChain.id;
    await this.setCurrentChain(chainId);
  }

  protected getIcon(id: string) {
    switch (id) {
      case "0x61":
        return <IconBNB width={this.iconSize} height={this.iconSize} />;
      default:
        return null;
    }
  }

  protected getDummyChain(id: string): Chain {
    return {
      id,
      icon: <IconWarning width={this.iconSize} height={this.iconSize} />,
      isSupported: false,
      isDefault: false,
    };
  }

  private getDefaultChain = (): Chain => {
    const chain = this.chains.find((chain) => chain.isDefault);
    if (!chain) {
      throw new Error("There must be at least one default chain");
    }
    return chain;
  }

  private cache = <T,>(fn: () => T, cacheName: string): T => {
    return this._cache[cacheName] ?? (this._cache[cacheName] = fn());
  };
}
