import React from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import IconWarning from "../icons/icon-warning";
import IconBNB from "../icons/icon-bnb";
import { defaultChain } from "../../web3-onboard";
import isLoggedInWallet from "./helpers/wallet-login-checker";

export enum WalletStatus {
  NOT_CONNECTED = "NOT_CONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
}

interface Chain {
  id: string;
  name?: string;
  icon: React.ReactNode;
  isDefault: boolean;
  isSupported: boolean;
}

interface Wallet {
  label: string;
  address: string;
  iconImageSrc: string;
}

const ICON_SIZE = 20;
const LOCAL_STORAGE_KEY = "__connected-wallet-label";

/**
 * The hook, that provides all Web3-related info and functions (wallet, active chain, connection status, etc).
 * Used as a wrapper for the currently used web3 library, which will allow us to easily and painlessly switch to a new library in the future (if we want to).
 * @returns
 */
export default function useWallet() {
  const [
    { wallet: onboardWallet, connecting },
    onboardConnect,
    onboardDisconnect,
  ] = useConnectWallet();
  const [{ chains: onboardChains, connectedChain }, setOnboardChain] =
    useSetChain();

  const wallet = React.useMemo((): Wallet | null => {
    const account = onboardWallet?.accounts?.[0];
    if (!account) {
      return null;
    }
    return {
      label: onboardWallet.label,
      address: account.address,
      iconImageSrc: getWalletIconSrc(onboardWallet.icon),
    };
  }, [onboardWallet]);

  const status = React.useMemo((): WalletStatus => {
    if (!!wallet) {
      return WalletStatus.CONNECTED;
    } else if (connecting) {
      return WalletStatus.CONNECTING;
    } else {
      return WalletStatus.NOT_CONNECTED;
    }
  }, [wallet, connecting]);

  const chains = React.useMemo((): Chain[] => {
    return onboardChains.map((chain) => {
      return {
        id: chain.id,
        icon: getIcon(chain.id),
        name: chain.label,
        isSupported: true,
        isDefault: chain.id === defaultChain.id,
      };
    });
  }, [onboardChains]);

  const chain = React.useMemo((): Chain | null => {
    if (!connectedChain) {
      return null;
    }
    const { id } = connectedChain;
    return chains.find((chain) => chain.id === id) ?? getDefaultChain(id);
  }, [chains, connectedChain]);

  const setChain = React.useCallback(
    (id: string) => {
      return setOnboardChain({ chainId: id });
    },
    [setOnboardChain]
  );

  const connect = React.useCallback(async () => {
    const [wallet] = await onboardConnect();
    if (wallet) {
      localStorage.setItem(LOCAL_STORAGE_KEY, wallet.label);
    }
  }, [onboardConnect]);

  const reconnect = React.useCallback(async () => {
    const label = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!label || wallet) {
      return;
    }

    // Do not try to connect to the wallet if the user is not logged in.
    const isLoggedIn = await isLoggedInWallet(label);
    if (!isLoggedIn) {
      return;
    }

    await onboardConnect({ autoSelect: { label, disableModals: true } });
  }, [wallet, onboardConnect]);

  const disconnect = React.useCallback(async () => {
    const label = wallet?.label || localStorage.getItem(LOCAL_STORAGE_KEY);
    if (label) {
      await onboardDisconnect({ label });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [wallet, onboardDisconnect]);

  return {
    wallet,
    status,
    connect,
    reconnect,
    disconnect,
    chain,
    chains,
    setChain,
  };
}

function getDefaultChain(id: string): Chain {
  return {
    id,
    icon: <IconWarning width={ICON_SIZE} height={ICON_SIZE} />,
    isSupported: false,
    isDefault: false,
  };
}

function getIcon(id: string) {
  switch (id) {
    case "0x61":
      return <IconBNB width={ICON_SIZE} height={ICON_SIZE} />;
    default:
      return null;
  }
}

const cachedIcons: Record<string, string> = {};

function getWalletIconSrc(iconContent: string) {
  const cachedIconSrc = cachedIcons[iconContent];
  if (cachedIconSrc) {
    return cachedIconSrc;
  }
  const svg = new Blob([iconContent], { type: "image/svg+xml" });
  return (cachedIcons[iconContent] = URL.createObjectURL(svg));
}
