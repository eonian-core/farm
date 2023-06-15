"use client";

import {
  Web3OnboardProvider,
  useConnectWallet,
  useSetChain,
} from "@web3-onboard/react";
import { ethers } from "ethers";
import React, { useContext, useEffect } from "react";
import web3Onboard from "../../web3-onboard";
import { ChainId } from "./wrappers/helpers";
import { Chain, Wallet, WalletStatus } from "./wrappers/types";
import * as W3O from "./wrappers/w3o-wallet-wrapper";

interface Props {
  children: React.ReactNode;
}

interface WalletWrapperContextValue {
  wallet: Wallet | null;
  status: WalletStatus;
  chain: Chain | null;
  chains: Chain[];
  provider: ethers.Provider | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setCurrentChain: (chainId: ChainId) => Promise<void>;
}

export const WalletWrapperContext =
  React.createContext<WalletWrapperContextValue>({
    wallet: null,
    status: WalletStatus.NOT_CONNECTED,
    chain: null,
    chains: [],
    provider: null,
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    setCurrentChain: () => Promise.resolve(),
  });

/**
 * Provides all Web3-related info and functions (wallet, active chain, connection status, etc).
 * Used as a wrapper for the currently used web3 library, which will allow us to easily and painlessly switch to a new library in the future (if we want to).
 */
const WalletWrapperImplementationProvider: React.FC<Props> = ({ children }) => {
  const useConnectWalletOptions = useConnectWallet();
  const [
    { wallet: onboardWallet, connecting },
    onboardConnect,
    onboardDisconnect,
  ] = useConnectWalletOptions;

  const useSetChainOptions = useSetChain();
  const [{ chains: onboardChains, connectedChain }, setOnboardChain] =
    useSetChainOptions;

  const wallet = React.useMemo(() => {
    return W3O.getWallet(onboardWallet);
  }, [onboardWallet]);

  const isWalletConnected = !!wallet;

  const status = React.useMemo(() => {
    return W3O.getStatus(isWalletConnected, connecting);
  }, [isWalletConnected, connecting]);

  const chains = React.useMemo(() => {
    return W3O.getAvailableChains(onboardChains);
  }, [onboardChains]);

  const chain = React.useMemo(() => {
    return W3O.getCurrentChain(chains, connectedChain?.id);
  }, [connectedChain?.id, chains]);

  const provider = React.useMemo(() => {
    return onboardWallet?.provider
      ? W3O.getProvider(onboardWallet?.provider)
      : null;
  }, [onboardWallet?.provider]);

  const connect = React.useCallback(async () => {
    const success = await W3O.connect(onboardConnect);
    if (success) {
      await W3O.autoSelectProperChain(chain, chains, setOnboardChain);
    }
  }, [chain, chains, onboardConnect, setOnboardChain]);

  const disconnect = React.useCallback(async () => {
    if (wallet) {
      await W3O.disconnect(wallet.label, onboardDisconnect);
    }
  }, [onboardDisconnect, wallet]);

  const setCurrentChain = React.useCallback(
    async (chainId: ChainId) => {
      await W3O.setCurrentChain(chainId, setOnboardChain);
    },
    [setOnboardChain]
  );

  useEffect(() => {
    W3O.reconnect(onboardConnect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: WalletWrapperContextValue = {
    wallet,
    status,
    chain,
    chains,
    provider,
    connect,
    disconnect,
    setCurrentChain,
  };

  return (
    <WalletWrapperContext.Provider value={value}>
      {children}
    </WalletWrapperContext.Provider>
  );
};

export const WalletWrapperProvider: React.FC<Props> = ({ children }) => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <WalletWrapperImplementationProvider>
        {children}
      </WalletWrapperImplementationProvider>
    </Web3OnboardProvider>
  );
};

export const useWalletWrapperContext = () => useContext(WalletWrapperContext);
