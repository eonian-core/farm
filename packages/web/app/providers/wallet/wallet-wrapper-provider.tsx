import {
  Web3OnboardProvider,
  useConnectWallet,
  useSetChain,
} from "@web3-onboard/react";
import React, { useContext } from "react";
import web3Onboard from "../../web3-onboard";
import DummyWalletWrapper from "./wrappers/dummy-wallet-wrapper";
import { WalletWrapper } from "./wrappers/wallet-wrapper";
import Web3OnboardWalletWrapper from "./wrappers/w3o-wallet-wrapper";

interface Props {
  children: React.ReactNode;
}

export const WalletWrapperContext = React.createContext<WalletWrapper>(
  new DummyWalletWrapper()
);

/**
 * Provides all Web3-related info and functions (wallet, active chain, connection status, etc).
 * Used as a wrapper for the currently used web3 library, which will allow us to easily and painlessly switch to a new library in the future (if we want to).
 */
const WalletWrapperImplementationProvider: React.FC<Props> = ({ children }) => {
  const useConnectWalletOptions = useConnectWallet();
  const [{ wallet, connecting }] = useConnectWalletOptions;

  const useSetChainOptions = useSetChain();
  const [{ chains, connectedChain }] = useSetChainOptions;

  const wrapper = React.useMemo(() => {
    return new Web3OnboardWalletWrapper(
      useConnectWalletOptions,
      useSetChainOptions
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, connecting, chains, connectedChain]);

  return (
    <WalletWrapperContext.Provider value={wrapper}>
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
