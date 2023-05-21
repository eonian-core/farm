import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { Chain, Wallet, WalletStatus, WalletWrapper } from "./wallet-wrapper";
import { defaultChain } from "../../../web3-onboard";

type WalletArgs = ReturnType<typeof useConnectWallet>;
type ChainArgs = ReturnType<typeof useSetChain>;

const cachedIcons: Record<string, string> = {};

export default class Web3OnboardWalletWrapper extends WalletWrapper {
  private walletArgs!: WalletArgs;
  private chainArgs!: ChainArgs;

  constructor() {
    super();
  }

  /**
   * (Re)initializes this wrapper. Should be called every time the "Web3Onboard" wallet is updated.
   * @param walletArgs Data from the "useConnectWallet" hook.
   * @param chainArgs Data from the "useSetChain" hook.
   * @returns Initialized "Web3OnboardWalletWrapper" instance.
   */
  public initialize = (walletArgs: WalletArgs, chainArgs: ChainArgs) => {
    this.reset();

    this.walletArgs = walletArgs;
    this.chainArgs = chainArgs;

    return this;
  };

  /**
   * Returns the mapped "Web3Onboard" wallet, by default using the first active account.
   * @returns Current wallet state.
   */
  protected override getWallet = (): Wallet | null => {
    const [{ wallet: onboardWallet }] = this.walletArgs;
    const account = onboardWallet?.accounts?.[0];
    if (!account) {
      return null;
    }

    return {
      label: onboardWallet.label,
      address: account.address,
      iconImageSrc: this.getWalletIconSrc(onboardWallet.icon),
    };
  };

  /**
   * Calculates the current connection status of the wallet.
   * @returns Wallet status.
   */
  protected override getStatus = (): WalletStatus => {
    const [{ connecting }] = this.walletArgs;
    if (!!this.wallet) {
      return WalletStatus.CONNECTED;
    } else if (connecting) {
      return WalletStatus.CONNECTING;
    } else {
      return WalletStatus.NOT_CONNECTED;
    }
  };

  /**
   * Returns an array of enabled chains (mapped "Web3Onboard" chains).
   * @returns Array of available chains.
   */
  protected override getAvailableChains = (): Chain[] => {
    const [{ chains: onboardChains }] = this.chainArgs;
    return onboardChains.map((chain) => {
      return {
        id: chain.id,
        icon: this.getIcon(chain.id),
        name: chain.label,
        isSupported: true,
        isDefault: chain.id === defaultChain.id,
      };
    });
  };

  /**
   * Finds and returns the currently active chain.
   * @returns Object of the selected chain.
   */
  protected override getCurrentChain = (): Chain | null => {
    const [{ connectedChain }] = this.chainArgs;
    if (!connectedChain) {
      return null;
    }
    const { id } = connectedChain;
    return (
      this.chains.find((chain) => chain.id === id) ?? this.getDefaultChain(id)
    );
  };

  /**
   * Opens the model with wallet options.
   * @returns Label of the selected wallet.
   */
  protected override connectInternal = async (): Promise<string> => {
    const [, onboardConnect] = this.walletArgs;
    const [wallet] = await onboardConnect();
    return wallet.label;
  };

  /**
   * Reconnects to the specified wallet.
   * @param walletLabel Wallet label to which you need to reconnect.
   */
  protected override reconnectInternal = async (
    walletLabel: string
  ): Promise<void> => {
    const [, onboardConnect] = this.walletArgs;
    await onboardConnect({
      autoSelect: { label: walletLabel, disableModals: true },
    });
  };

  /**
   * Disconnects from the connected wallet.
   */
  protected override disconnectInternal = async (): Promise<void> => {
    const [, , onboardDisconnect] = this.walletArgs;
    if (this.wallet) {
      await onboardDisconnect({ label: this.wallet.label });
    }
  };

  /**
   * Sets the currently active network (chain).
   * @param chainId Identifier of the chain to which you need to connect.
   */
  protected override setCurrentChainInternal = async (
    chainId: string
  ): Promise<boolean> => {
    const [, setOnboardChain] = this.chainArgs;
    return await setOnboardChain({ chainId });
  };

  private getWalletIconSrc(iconContent: string) {
    const cachedIconSrc = cachedIcons[iconContent];
    if (cachedIconSrc) {
      return cachedIconSrc;
    }
    const svg = new Blob([iconContent], { type: "image/svg+xml" });
    return (cachedIcons[iconContent] = URL.createObjectURL(svg));
  }
}
