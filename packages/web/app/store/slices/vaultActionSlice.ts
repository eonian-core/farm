import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { UpdateOptions } from 'react-toastify'
import { toast } from 'react-toastify'
import type { Vault } from '../../api'
import { createVaultActionToast } from '../../earn/[...vault]/components'
import { parseError } from '../../shared'

const TOAST_ID = 'vault-action-toast'

export enum FormAction {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export enum FormActionStep {
  APPROVAL = 'APPROVAL',
  CONFIRMATION = 'CONFIRMATION',
  DONE = 'DONE',
}

export const formActionSteps: Record<FormAction, FormActionStep[]> = {
  [FormAction.DEPOSIT]: [FormActionStep.APPROVAL, FormActionStep.CONFIRMATION],
  [FormAction.WITHDRAW]: [FormActionStep.CONFIRMATION],
}

interface VaultActionSlice {
  activeAction: FormAction | null

  vaultName: string | null
  assetSymbol: string | null
  amountBN: string

  steps: FormActionStep[]
  completedSteps: FormActionStep[]
  stepsSkipped: number
  isTransactionActive: boolean

  error: string | null
}

const initialState: VaultActionSlice = {
  activeAction: null,

  vaultName: null,
  assetSymbol: null,
  amountBN: '0',

  steps: [],
  completedSteps: [],
  stepsSkipped: 0,
  isTransactionActive: false,

  error: null,
}

interface PrepareActionPayload {
  action: FormAction
  vault: Vault
  amount: bigint
  stepsToSkip?: number
}

const vaultActionSlice = createSlice({
  name: 'vaultAction',
  initialState,
  reducers: {
    resetState: () => initialState,
    initVaultAction: (state, action: PayloadAction<PrepareActionPayload>) => {
      const { action: newAction, vault, amount, stepsToSkip = 0 } = action.payload

      state.activeAction = newAction

      state.vaultName = vault.name
      state.assetSymbol = vault.asset.symbol
      state.amountBN = amount.toString()

      state.steps = [...formActionSteps[newAction]]
      state.completedSteps = []

      if (stepsToSkip > 0) {
        state.completedSteps = state.steps.slice(0, stepsToSkip)
        state.stepsSkipped = stepsToSkip
      }

      state.isTransactionActive = false
      state.error = null
    },
    goToNextActionStep: (state) => {
      const { error, activeAction, steps, completedSteps } = state

      if (!activeAction || !!error) {
        return initialState
      }

      state.isTransactionActive = false
      const nextActionStep = steps[completedSteps.length]
      state.completedSteps = [...state.completedSteps, nextActionStep]

      const progress = state.completedSteps.length / steps.length
      const isDone = progress >= 1
      toast.update(TOAST_ID, {
        progress: isDone ? undefined : progress,
        autoClose: isDone ? 7500 : false,
      })
    },
    setTransactionStarted: (state) => {
      state.isTransactionActive = true
    },
    failVaultAction: (state, action: PayloadAction<Error>) => {
      const error = action.payload
      const [message, severity] = parseError(error)
      const update: UpdateOptions = {
        render: message,
        type: severity,
        autoClose: 7500,
        progress: 0,
      }
      toast.update(TOAST_ID, update)

      state.error = message
    },
  },
})

export const prepareVaultAction = createAsyncThunk(
  'vaultAction/prepare',
  (payload: PrepareActionPayload, { dispatch }) => {
    const { resetState, initVaultAction } = vaultActionSlice.actions

    toast.update(TOAST_ID, {
      progress: 0,
      autoClose: false,
    })

    dispatch(initVaultAction(payload))

    toast(createVaultActionToast(), {
      closeOnClick: false,
      toastId: TOAST_ID,
      progress: 0,
      autoClose: false,
    })

    const unsubscribe = toast.onChange(({ id, status }) => {
      if (id === TOAST_ID && status === 'removed') {
        dispatch(resetState())
        unsubscribe()
      }
    })
  },
)

export const stopVaultAction = createAsyncThunk('vaultAction/stop', () => {
  toast.dismiss(TOAST_ID)
})

export const { failVaultAction, initVaultAction, goToNextActionStep, setTransactionStarted } = vaultActionSlice.actions
export default vaultActionSlice.reducer
