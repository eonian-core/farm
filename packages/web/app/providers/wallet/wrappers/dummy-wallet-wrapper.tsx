import { Chain, Wallet, WalletStatus, WalletWrapper } from "./wallet-wrapper";

/**
 * Just an empty implementation to use as the default context value.
 */
export default class DummyWalletWrapper extends WalletWrapper {
  protected getWallet = (): Wallet | null => {
    return null;
  };

  protected getCurrentChain = (): Chain | null => {
    return null;
  };

  protected getAvailableChains = (): Chain[] => {
    return [];
  };

  protected getStatus = (): WalletStatus => {
    return WalletStatus.NOT_CONNECTED;
  };

  protected connectInternal = (): Promise<string | null> => {
    return Promise.resolve(null);
  };

  protected reconnectInternal = (): Promise<void> => {
    return Promise.resolve();
  };

  protected disconnectInternal = (): Promise<void> => {
    return Promise.resolve();
  };

  protected setCurrentChainInternal = (): Promise<boolean> => {
    return Promise.resolve(false);
  };
}
