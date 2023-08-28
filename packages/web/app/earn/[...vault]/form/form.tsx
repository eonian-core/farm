'use client'

import React from 'react'

import { Card } from '@nextui-org/react'
import type { Vault } from '../../../api'
import { useAppSelector } from '../../../store/hooks'
import { useWalletWrapperContext } from '../../../providers/wallet/wallet-wrapper-provider'
import { WalletStatus } from '../../../providers/wallet/wrappers/types'
import { PercentButtonGroup, VaultInfoCard, VaultLink } from '../components'
import { useExecuteTransaction, useNumberInputValue, useVaultUserInfo } from '../hooks'
import { FormAction, FormActionStep } from '../../../store/slices/vaultActionSlice'
import { getActiveStepSelector } from '../../../store'
import type { ChainId } from '../../../providers/wallet/wrappers/helpers'
import FormInput from './form-input'
import FormButton from './form-button'
import FormHeader from './form-header'
import styles from './form.module.scss'

interface Props {
  vault: Vault
  chainId: ChainId
}

const Form: React.FC<Props> = ({ vault, chainId }) => {
  const { wallet, status } = useWalletWrapperContext()

  const refetechVaultUserData = useVaultUserInfo(vault, {
    autoUpdateInterval: 5000,
  })

  const { isLoading, lastRequestForWallet } = useAppSelector(state => state.vaultUser)

  const [formAction, setFormAction] = React.useState<FormAction>(FormAction.DEPOSIT)

  const [value, displayValue, handleValueChange] = useInputValue(vault)

  const balances = useBalance()
  const formBalance = formAction === FormAction.DEPOSIT ? balances.inWallet : balances.inVault

  const vaultChain = useVaultChain(chainId)
  const hasPendingTransactions = useHasPendingTransactions()
  const executeTransaction = useExecuteTransaction()

  const handleSubmit = React.useCallback(
    async (formAction: FormAction) => {
      // Refresh vault <-> user data before the transaction to make sure all calculations are correct.
      await refetechVaultUserData!()

      // Execute Deposit/Withdraw transaction
      const success = await executeTransaction(formAction, vault, value)
      if (success) {
        // Refresh wallet balance & vault deposit after the transaction executed.
        void refetechVaultUserData!()

        // Reset form input
        handleValueChange(0n)
      }
    },
    [executeTransaction, refetechVaultUserData, handleValueChange, vault, value],
  )

  const isFirstRequestFinished = lastRequestForWallet === wallet?.address
  const isWalletNotConnected = status === WalletStatus.NOT_CONNECTED
  const isFormReady = !isLoading || isFirstRequestFinished || isWalletNotConnected

  return (
    <div className={styles.container}>
      <Card variant="flat" className={styles.disclamer}>
        <p>🛠 Alpha test application may display inaccurate APY.</p>
      </Card>
      <Card variant="bordered">
        <FormHeader currentAction={formAction} onCurrentActionChange={setFormAction} />

        <Card.Divider />

        <VaultInfoCard
          className={styles.fragment}
          value={value}
          currentDeposit={balances.inVault}
          vault={vault}
          formAction={formAction}
        />

        <Card.Divider />

        <Card.Body className={styles.fragment}>
          <PercentButtonGroup
            inputValue={value}
            maxValue={formBalance}
            onValueChange={handleValueChange}
            disabled={hasPendingTransactions}
          />
          <FormInput
            assetSymbol={vault.asset.symbol}
            decimals={vault.asset.decimals}
            value={displayValue}
            balance={formBalance}
            onChange={handleValueChange}
            isLoading={!isFormReady}
            disabled={hasPendingTransactions}
          />
          <FormButton
            vaultChain={vaultChain}
            disabled={!isFormReady}
            formAction={formAction}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit}
            isLoading={hasPendingTransactions}
          />
        </Card.Body>
      </Card>
      <h4>
        <VaultLink vault={vault} chainId={vaultChain.id} />
      </h4>
    </div>
  )
}

function useInputValue(vault: Vault) {
  return useNumberInputValue(0n, vault.asset.decimals)
}

export interface Balance {
  inWallet: bigint
  inVault: bigint
}

function useBalance(): Balance {
  const { walletBalanceBN, vaultBalanceBN } = useAppSelector(state => state.vaultUser)
  const wallet = BigInt(walletBalanceBN)
  const vault = BigInt(vaultBalanceBN)
  return {
    inWallet: wallet,
    inVault: vault,
  }
}

function useHasPendingTransactions() {
  const activeStep = useAppSelector(getActiveStepSelector)
  return activeStep !== null && activeStep !== FormActionStep.DONE
}

function useVaultChain(chainId: ChainId) {
  const { chains } = useWalletWrapperContext()
  return React.useMemo(() => chains.find(chain => chain.id === chainId)!, [chains, chainId])
}

export default Form
