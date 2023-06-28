import * as ethers from "ethers";
import { useSetChain } from "@web3-onboard/react";
import { Chain, Wallet, WalletStatus } from "./types";
import { defaultChain } from "../../../web3-onboard";
import {
  ChainId,
  getChainIcon,
  getDummyChain,
  getMulticallAddress,
  isLoggedInWallet,
  WalletPersistance,
} from "./helpers";
import {
  ConnectOptions,
  DisconnectOptions,
  EIP1193Provider,
  WalletState,
} from "@web3-onboard/core";

type ChainArgs = ReturnType<typeof useSetChain>;

const iconSize = 20;
const cachedIcons: Record<string, string> = {};

/**
 * Returns the mapped "Web3Onboard" wallet, by default using the first active account.
 * @returns Current wallet state.
 */
export const getWallet = (onboardWallet: WalletState | null): Wallet | null => {
  const account = onboardWallet?.accounts?.[0];
  if (!account) {
    return null;
  }

  return {
    label: onboardWallet.label,
    address: account.address,
    iconImageSrc: getWalletIconSrc(onboardWallet.icon),
  };
};

/**
 * Calculates the current connection status of the wallet.
 * @returns Wallet status.
 */
export const getStatus = (
  isConnected: boolean,
  isConnecting: boolean
): WalletStatus => {
  if (isConnected) {
    return WalletStatus.CONNECTED;
  } else if (isConnecting) {
    return WalletStatus.CONNECTING;
  } else {
    return WalletStatus.NOT_CONNECTED;
  }
};

/**
 * Returns an array of enabled chains (mapped "Web3Onboard" chains).
 * @returns Array of available chains.
 */
export const getAvailableChains = (
  onboardChains: ChainArgs[0]["chains"]
): Chain[] => {
  return onboardChains.map((chain) => {
    const id = ChainId.parse(chain.id);
    return {
      id,
      icon: getChainIcon(id, iconSize),
      name: chain.label,
      isSupported: true,
      isDefault: chain.id === defaultChain.id,
      multicallAddress: getMulticallAddress(id),
    };
  });
};

/**
 * Finds and returns the currently active chain.
 * @returns Object of the selected chain.
 */
export const getCurrentChain = (
  chains: Chain[],
  chainId?: string
): Chain | null => {
  if (!chainId) {
    return null;
  }
  const id = ChainId.parse(chainId);
  return chains.find((chain) => chain.id === id) ?? getDummyChain(id, iconSize);
};

/**
 * Returns ethers provider.
 * @param provider - The web3-onboard's provider.
 */
export const getProvider = (provider: EIP1193Provider): ethers.BrowserProvider => {
  return new ethers.BrowserProvider(provider, "any");
};

/**
 * Opens the model with wallet options.
 * @returns Label of the selected wallet.
 */
export const connect = async (
  onboardConnect: (options?: ConnectOptions) => Promise<WalletState[]>
): Promise<boolean> => {
  try {
    const [wallet] = await onboardConnect();
    const walletLabel = wallet?.label;
    if (!walletLabel) {
      return false;
    }
    WalletPersistance.saveWalletLabel(walletLabel);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Changes the current active chain if necessary.
 * Selects the last active network or fallbacks to the default value.
 * @returns "True" if the chain was successfully changed.
 */
export const autoSelectProperChain = async (
  chain: Chain | null,
  chains: Chain[],
  setOnboardChain: ChainArgs[1]
) => {
  // Skip if the current active chain is supported.
  if (chain?.isSupported) {
    return;
  }
  const lastActiveChainId = WalletPersistance.getLastActiveChain();
  const chainId =
    lastActiveChainId !== ChainId.UNKNOWN
      ? ChainId.parse(lastActiveChainId)
      : getDefaultChain(chains).id;
  await setCurrentChain(chainId, setOnboardChain);
};

/**
 * Reconnects to the specified wallet.
 * @param walletLabel Wallet label to which you need to reconnect.
 */
export const reconnect = async (
  onboardConnect: (options?: ConnectOptions) => Promise<WalletState[]>
): Promise<void> => {
  // Do not reconnect if there is no information about the last connected wallet
  const walletLabel = WalletPersistance.getWalletLabel();
  if (!walletLabel) {
    return;
  }

  // Do not try to connect to the wallet if the user is not logged in.
  const isLoggedIn = await isLoggedInWallet(walletLabel);
  if (!isLoggedIn) {
    return;
  }

  await onboardConnect({
    autoSelect: { label: walletLabel, disableModals: true },
  });
};

/**
 * Disconnects from the connected wallet.
 */
export const disconnect = async (
  walletLabel: string | null,
  onboardDisconnect: (wallet: DisconnectOptions) => Promise<WalletState[]>
): Promise<void> => {
  if (walletLabel) {
    await onboardDisconnect({ label: walletLabel });
  }
  WalletPersistance.removeWalletlabel();
};

/**
 * Sets the currently active network (chain).
 * @param chainId Identifier of the chain to which you need to connect.
 */
export const setCurrentChain = async (
  chainId: ChainId,
  setOnboardChain: ChainArgs[1]
): Promise<void> => {
  const success = await setOnboardChain({ chainId: ChainId.toHex(chainId) });
  if (success) {
    WalletPersistance.saveLastActiveChain(chainId);
  }
};

const getWalletIconSrc = (iconContent: string) => {
  const cachedIconSrc = cachedIcons[iconContent];
  if (cachedIconSrc) {
    return cachedIconSrc;
  }
  const svg = new Blob([iconContent], { type: "image/svg+xml" });
  return (cachedIcons[iconContent] = URL.createObjectURL(svg));
};

export const getDefaultChain = (chains: Chain[]): Chain => {
  const chain = chains.find((chain) => chain.isDefault);
  if (!chain) {
    throw new Error("There must be at least one default chain");
  }
  return chain;
};
