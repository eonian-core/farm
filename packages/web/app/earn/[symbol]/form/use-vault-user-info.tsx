import React from "react";
import { Vault } from "../../../api";
import useMulticall, {
  MulticallRequest,
} from "../../../hooks/web3/use-multicall/use-multicall";

import VaultABI from "../../../abi/Vault.json";
import ERC20ABI from "../../../abi/ERC20.json";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { executeAfter } from "../../../shared/async/execute-after";

interface Params {
  autoUpdateInterval?: number;
}

interface Data {
  walletBalance: number;
  vaultBalance: number;
}

type HookResult = [
  data: Data,
  isDataReady: boolean,
  isLoading: boolean,
  refetch: () => Promise<any>
];

export default function useVaultUserInfo(
  vault: Vault,
  params: Params = {}
): HookResult {
  const { autoUpdateInterval } = params;

  const { wallet } = useWalletWrapperContext();

  const { address: walletAddress } = wallet ?? {};
  const { address: vaultAddress, underlyingAsset } = vault;
  const { address: assetAddress } = underlyingAsset;

  /**
   * Prepares requests for a multicall request.
   */
  const requests = React.useMemo((): MulticallRequest[] => {
    return getRequests(vaultAddress, assetAddress, walletAddress);
  }, [vaultAddress, assetAddress, walletAddress]);

  /**
   * Makes a multicall request based on previously prepared data.
   */
  const [result, isLoading, refetch] = useMulticall(requests);

  /**
   * Performs automatic updates at fixed intervals.
   * Only if {@link autoUpdateInterval} is specified.
   */
  React.useEffect(() => {
    if (isLoading || !autoUpdateInterval) {
      return;
    }
    return executeAfter(autoUpdateInterval, () => refetch());
  }, [autoUpdateInterval, isLoading, refetch]);

  /**
   * Checks whether this hook should return data or not.
   */
  const hasData = React.useMemo(() => {
    return (
      requests.length > 0 &&
      result.length > 0 &&
      result.every(({ success }) => success)
    );
  }, [requests, result]);

  /**
   * Transforms a raw multicall response into the required data.
   */
  const data = React.useMemo((): Data => {
    if (!hasData) {
      return {
        vaultBalance: 0,
        walletBalance: 0,
      };
    }
    const listData = result.map(({ data }) => BigInt(data));
    const [vaultBalance, vaultDecimals, assetBalance, assetDecimals] = listData;
    return {
      vaultBalance: Number(vaultBalance / 10n ** vaultDecimals),
      walletBalance: Number(assetBalance / 10n ** assetDecimals),
    };
  }, [hasData, result]);

  return [data, hasData, isLoading, refetch];
}


function getRequests(
  vaultAddress: string,
  assetAddress: string,
  walletAddress?: string
): MulticallRequest[] {
  if (!walletAddress) {
    return [];
  }
  return [
    {
      address: vaultAddress,
      abi: VaultABI,
      functionName: "maxWithdraw",
      args: [walletAddress],
    },
    {
      address: vaultAddress,
      abi: VaultABI,
      functionName: "decimals",
      args: [],
    },
    {
      address: assetAddress,
      abi: ERC20ABI,
      functionName: "balanceOf",
      args: [walletAddress],
    },
    {
      address: assetAddress,
      abi: ERC20ABI,
      functionName: "decimals",
      args: [],
    },
  ];
}
