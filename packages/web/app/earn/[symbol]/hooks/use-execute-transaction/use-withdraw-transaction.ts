import React from "react";
import { Vault } from "../../../../api";

export function useWithdrawTransaction() {
  const execute = async (vault: Vault, amount: bigint) => {};
  return React.useCallback(execute, []);
}
