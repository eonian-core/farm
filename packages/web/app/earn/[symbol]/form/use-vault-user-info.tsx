import React, { useEffect } from "react";
import { Vault } from "../../../api";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { executeAfter } from "../../../shared/async/execute-after";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchVaultUserData,
  reset,
} from "../../../store/slices/vaultUserSlice";
import { WalletStatus } from "../../../providers/wallet/wrappers/wallet-wrapper";

interface Params {
  autoUpdateInterval?: number;
}

export default function useVaultUserInfo(vault: Vault, params: Params = {}) {
  const { autoUpdateInterval } = params;

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.vaultUser);

  const { wallet, provider, chain, status } = useWalletWrapperContext();
  const { multicallAddress } = chain ?? {};
  const { address: walletAddress } = wallet ?? {};
  const { address: vaultAddress, underlyingAsset } = vault;
  const { address: assetAddress } = underlyingAsset;
  const hasProvider = !!provider;

  const refetch = React.useMemo(() => {
    if (!walletAddress || !multicallAddress || !provider) {
      return null;
    }
    return () => {
      const params = {
        walletAddress,
        vaultAddress,
        assetAddress,
        multicallAddress,
        provider,
      };
      dispatch(fetchVaultUserData(params));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    walletAddress,
    vaultAddress,
    assetAddress,
    multicallAddress,
    hasProvider
  ]);

  /**
   * Retrieves fresh data when something changed (wallet/vault/chain).
   */
  useEffect(() => {
    refetch?.();
  }, [refetch]);

  /**
   * Resets vault-user data when wallet is disconnected.
   */
  useEffect(() => {
    if (status === WalletStatus.NOT_CONNECTED) {
      dispatch(reset())
    }
  }, [status, dispatch])

  /**
   * Resets vault-user data after leaving the page.
   */
  useEffect(() => {
    return () => { dispatch(reset()) };
  }, [dispatch])

  /**
   * Performs automatic updates at fixed intervals.
   * Only if {@link autoUpdateInterval} is specified.
   */
  React.useEffect(() => {
    if (isLoading || !autoUpdateInterval) {
      return;
    }
    return executeAfter(autoUpdateInterval, () => refetch?.());
  }, [autoUpdateInterval, isLoading, refetch]);
}
