import type { Provider } from 'ethers'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { MulticallRequest } from '../../shared'
import { Multicall, createERC20Request, createVaultRequest } from '../../shared'

interface FetchParams {
  walletAddress: string
  assetAddress: string
  vaultAddress: string
  multicallAddress: string
  provider: Provider
}

export const fetchVaultUserData = createAsyncThunk(
  'vaultUser/multicall',
  async ({ walletAddress, assetAddress, vaultAddress, multicallAddress, provider }: FetchParams) => {
    const requests = getRequests(walletAddress, assetAddress, vaultAddress)
    const multicall = new Multicall(multicallAddress, provider, requests)
    const responses = await multicall.makeRequest()
    const errorIndex = responses.findIndex(response => !response.success)
    if (errorIndex >= 0) {
      throw new Error(`Error occured when requesting: ${JSON.stringify(requests[errorIndex])}`)
    }

    return {
      // Redux doesn't allow to store BigInt(s) in the store (https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)
      // So we need to convert it back to string and keep big number in string representation.
      data: responses.map(response => (response.data as object).toString()),
      requestForWallet: walletAddress,
    }
  },
)

interface VaultUserSlice {
  walletBalanceBN: string
  vaultBalanceBN: string
  assetAllowanceBN: string
  vaultDecimals: number
  assetDecimals: number
  isLoading: boolean
  lastRequestForWallet: string
}

const initialState: VaultUserSlice = {
  walletBalanceBN: '0',
  vaultBalanceBN: '0',
  assetAllowanceBN: '0',
  vaultDecimals: 0,
  assetDecimals: 0,
  isLoading: true,
  lastRequestForWallet: '',
}

const vaultUserSlice = createSlice({
  name: 'vaultUser',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVaultUserData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchVaultUserData.fulfilled, (state, action) => {
        state.isLoading = false

        const { data, requestForWallet } = action.payload
        const [vaultBalance, vaultDecimals, assetBalance, assetDecimals, assetAllowance] = data

        state.assetAllowanceBN = assetAllowance
        state.walletBalanceBN = assetBalance
        state.assetDecimals = Number.parseInt(assetDecimals)

        state.vaultBalanceBN = vaultBalance
        state.vaultDecimals = Number.parseInt(vaultDecimals)

        state.lastRequestForWallet = requestForWallet
      })
      .addCase(fetchVaultUserData.rejected, (state) => {
        state.isLoading = false
      })
  },
})

function getRequests(walletAddress: string, assetAddress: string, vaultAddress: string): MulticallRequest[] {
  return [
    createVaultRequest(vaultAddress, 'maxWithdraw', [walletAddress]),
    createVaultRequest(vaultAddress, 'decimals'),
    createERC20Request(assetAddress, 'balanceOf', [walletAddress]),
    createERC20Request(assetAddress, 'decimals'),
    createERC20Request(assetAddress, 'allowance', [walletAddress, vaultAddress]),
  ]
}

export const { reset } = vaultUserSlice.actions
export default vaultUserSlice.reducer
