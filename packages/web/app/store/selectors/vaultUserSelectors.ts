import { createSelector } from "@reduxjs/toolkit";
import { toNumberFromDecimals } from "../../shared";
import { RootState } from "../store";

export const getBalancesSelector = createSelector(
  (state: RootState) => state.vaultUser,
  ({ walletBalanceBN, vaultBalanceBN, assetDecimals }) => {
    return {
      walletBalance: toNumberFromDecimals(walletBalanceBN, assetDecimals),
      vaultBalance: toNumberFromDecimals(vaultBalanceBN, assetDecimals),
      walletBalanceBN: BigInt(walletBalanceBN),
      vaultBalanceBN: BigInt(vaultBalanceBN),
    };
  }
);
