"use client";

import React from "react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import Web3OnboardWalletWrapper from "./wrappers/w3o-wallet-wrapper";
import { WalletWrapper } from "./wrappers/wallet-wrapper";

/**
 * The hook, that provides all Web3-related info and functions (wallet, active chain, connection status, etc).
 * Used as a wrapper for the currently used web3 library, which will allow us to easily and painlessly switch to a new library in the future (if we want to).
 * @returns Wallet state and all the controls.
 */
export default function useWallet(): WalletWrapper {
  const walletWrapperRef = React.useRef<Web3OnboardWalletWrapper>(
    new Web3OnboardWalletWrapper()
  );

  const useConnectWalletOptions = useConnectWallet();
  const useSetChainOptions = useSetChain();
  const [{ wallet, connecting }] = useConnectWalletOptions;
  const [{ chains, connectedChain }] = useSetChainOptions;

  return React.useMemo(() => {
    const walletWrapper = walletWrapperRef.current;
    return walletWrapper.initialize(
      useConnectWalletOptions,
      useSetChainOptions
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, connecting, chains, connectedChain]);
}
