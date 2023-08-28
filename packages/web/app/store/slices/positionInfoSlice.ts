import type { Provider } from 'ethers'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { MulticallRequest } from '../../shared'
import { Multicall, createVaultRequest } from '../../shared'

interface FetchParams {
  walletAddress: string
  vaultAddresses: string[]
  multicallAddress: string
  provider: Provider
}

const getError = (message?: any) => `Error occured when requesting data: "${message || 'Unknown error'}"`

export const fetchPositionInfo = createAsyncThunk(
  'positionInfo/multicall',
  async ({ walletAddress, vaultAddresses, multicallAddress, provider }: FetchParams) => {
    const requests = getRequests(walletAddress, vaultAddresses)
    const multicall = new Multicall(multicallAddress, provider, requests)
    const responses = await multicall.makeRequest()

    const { data, errors } = responses.reduce(
      (map, response, index) => {
        const address = vaultAddresses[index]
        if (response.success) {
          map.data[address] = responses[index].data as bigint
        }
        else {
          map.errors[address] = getError(response.data)
        }
        return map
      },
      {
        data: {} as Record<string, bigint>,
        errors: {} as Record<string, string>,
      },
    )

    return {
      data,
      errors,
      requestForWallet: walletAddress,
    }
  },
)

interface PositionInfoSlice {
  errors: Record<string, string> | string
  vaultBalances: Record<string, bigint>
  isLoading: boolean
  lastRequestForWallet: string
}

const initialState: PositionInfoSlice = {
  vaultBalances: {},
  errors: {},
  isLoading: false,
  lastRequestForWallet: '',
}

const positionInfoSlice = createSlice({
  name: 'positionInfo',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPositionInfo.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPositionInfo.fulfilled, (state, action) => {
        const { data, requestForWallet } = action.payload
        state.isLoading = false
        state.errors = {}
        state.vaultBalances = data
        state.lastRequestForWallet = requestForWallet
      })
      .addCase(fetchPositionInfo.rejected, (state, action) => {
        state.isLoading = false
        state.errors = getError(action.error.message)
      })
  },
})

function getRequests(walletAddress: string, vaultAddresses: string[]): MulticallRequest[] {
  return vaultAddresses.map(vaultAddress => createVaultRequest(vaultAddress, 'maxWithdraw', [walletAddress]))
}

export const { reset } = positionInfoSlice.actions
export default positionInfoSlice.reducer
