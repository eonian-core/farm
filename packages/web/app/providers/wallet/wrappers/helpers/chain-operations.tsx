import IconCoin, { CoinIcon } from "../../../../components/icons/icon-coin";
import IconWarning from "../../../../components/icons/icon-warning";
import { Chain } from "../types";
import { ChainId } from "./wallet-chain-id";

export const getChainIcon = (
  id: ChainId,
  iconSize: number
): React.ReactNode => {
  let icon: CoinIcon;

  switch (id) {
    case ChainId.SEPOLIA:
      icon = CoinIcon.ETH;
      break;
    case ChainId.BSC_MAINNET:
      icon = CoinIcon.BNB;
      break;
    case ChainId.UNKNOWN:
      return <IconWarning width={iconSize} height={iconSize} />;
  }

  return <IconCoin symbol={icon} width={iconSize} height={iconSize} />;
};

export const getChainExplorer = (id: ChainId): string | null => {
  switch (id) {
    case ChainId.SEPOLIA:
      return "https://sepolia.etherscan.io/";
    case ChainId.BSC_MAINNET:
      return "https://bscscan.com/";
    case ChainId.UNKNOWN:
      return null;
  }
};

/**
 * See https://www.multicall3.com/deployments
 * @param id - Chain id
 * @returns Multicall address for the specified chain
 */
export const getMulticallAddress = (id: ChainId): string => {
  switch (id) {
    case ChainId.SEPOLIA:
    case ChainId.BSC_MAINNET:
      return "0xcA11bde05977b3631167028862bE2a173976CA11";
    case ChainId.UNKNOWN:
      return "0x0";
  }
};

/**
 * Returns RPC URL endpoint for specific chain id.
 * @param id - Chain id
 * @returns String URL or null
 */
export const getRPCEndpoint = (id: ChainId): string | undefined => {
  switch (id) {
    case ChainId.SEPOLIA:
      return process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    case ChainId.BSC_MAINNET:
      return (
        process.env.NEXT_PUBLIC_BSC_MAINNET_RPC_URL ||
        "https://bsc-dataseed1.binance.org/"
      );
    case ChainId.UNKNOWN:
      return undefined;
  }
};

export const getDummyChain = (id: ChainId, iconSize: number): Chain => ({
  id,
  icon: getChainIcon(ChainId.UNKNOWN, iconSize),
  isSupported: false,
  isDefault: false,
  multicallAddress: getMulticallAddress(ChainId.UNKNOWN),
});
