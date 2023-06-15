import { Provider } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Multicall, MulticallRequest } from "../../shared/web3/multicall";
import VaultABI from "../../abi/Vault.json";
import ERC20ABI from "../../abi/ERC20.json";
import { denominateTokenValue } from "../../shared/humanize";

interface FetchParams {
  walletAddress: string;
  assetAddress: string;
  vaultAddress: string;
  multicallAddress: string;
  provider: Provider;
}

export const fetchVaultUserData = createAsyncThunk(
  "vaultUser/multicall",
  async ({
    walletAddress,
    assetAddress,
    vaultAddress,
    multicallAddress,
    provider,
  }: FetchParams) => {
    const requests = getRequests(walletAddress, assetAddress, vaultAddress);
    const multicall = new Multicall(multicallAddress, provider, requests);
    const responses = await multicall.makeRequest();
    const errorIndex = responses.findIndex((response) => !response.success);
    if (errorIndex >= 0) {
      throw new Error(`Error occured when requesting: ${requests[errorIndex]}`);
    }
    return {
      // Redux doesn't allow to store BigInt(s) in the store (https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)
      // So we need to convert it back to string and keep big number in string representation.
      data: responses.map((response) => response.data.toString()),
      requestForWallet: walletAddress,
    };
  }
);

interface VaultUserSlice {
  walletBalance: number;
  walletBalanceBig: string;
  vaultBalance: number;
  vaultBalanceBig: string;
  assetAllowance: number;
  assetAllowanceBig: string;
  isLoading: boolean;
  lastRequestForWallet: string;
}

const initialState: VaultUserSlice = {
  walletBalance: 0,
  walletBalanceBig: "0",
  vaultBalance: 0,
  vaultBalanceBig: "0",
  assetAllowance: 0,
  assetAllowanceBig: "0",
  isLoading: true,
  lastRequestForWallet: "0x",
};

const vaultUserSlice = createSlice({
  name: "vaultUser",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVaultUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVaultUserData.fulfilled, (state, action) => {
        state.isLoading = false;

        const { data, requestForWallet } = action.payload;
        const [
          vaultBalance,
          vaultDecimals,
          assetBalance,
          assetDecimals,
          assetAllowance,
        ] = data;

        state.walletBalanceBig = assetBalance;
        state.walletBalance = denominateTokenValue(assetBalance, assetDecimals);

        state.vaultBalanceBig = vaultBalance;
        state.vaultBalance = denominateTokenValue(vaultBalance, vaultDecimals);

        state.assetAllowanceBig = assetAllowance;
        state.assetAllowance = denominateTokenValue(
          assetAllowance,
          assetDecimals
        );

        state.lastRequestForWallet = requestForWallet;
      })
      .addCase(fetchVaultUserData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

function getRequests(
  walletAddress: string,
  assetAddress: string,
  vaultAddress: string
): MulticallRequest[] {
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
    {
      address: assetAddress,
      abi: ERC20ABI,
      functionName: "allowance",
      args: [walletAddress, vaultAddress],
    },
  ];
}

export const { reset } = vaultUserSlice.actions;
export default vaultUserSlice.reducer;
