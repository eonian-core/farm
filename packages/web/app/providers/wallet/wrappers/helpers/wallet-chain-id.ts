export enum ChainId {
  SEPOLIA = 11155111,
  BSC_MAINNET = 56,
  UNKNOWN = -1,
}

export namespace ChainId {
  export function toHex(chainId: ChainId): string {
    return '0x' + chainId.toString(16);
  }

  export function parse(value: string | number): ChainId {
    const chainId =
      typeof value === "string" && value.startsWith("0x")
        ? parseInt(value, 16)
        : +value;
    const index = Object.values(ChainId).indexOf(chainId);
    return index < 0 ? ChainId.UNKNOWN : (chainId as ChainId);
  }

  export function getByName(value: string | null | undefined): ChainId {
    value ??= '';
    value = value.toUpperCase();
    return value in ChainId ? ChainId[value as any] as unknown as ChainId : ChainId.UNKNOWN;
  }

  export function getName(chainId: ChainId): string {
    return Object.keys(ChainId)[Object.values(ChainId).indexOf(chainId)];
  }
}
