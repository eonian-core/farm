'use client'

import React from 'react'
import { JsonRpcProvider } from 'ethers'
import type { Vault } from '../../api'
import { ChainId, getRPCEndpoint } from '../../providers/wallet/wrappers/helpers'
import { defaultChain } from '../../web3-onboard'
import { fetchPositionInfo } from '../../store/slices/positionInfoSlice'
import { useWalletWrapperContext } from '../../providers/wallet/wallet-wrapper-provider'
import { useAppDispatch } from '../../store/hooks'
import { NetworkSelector } from './network-selector'
import { VaultTable } from './vault-table'

import styles from './vault-list.module.scss'

export type VaultsByChain = Record<ChainId, Vault[]>

interface Props {
  vaultsByChain: VaultsByChain
}

export function VaultList({ vaultsByChain }: Props) {
  const defaultChainId = ChainId.parse(defaultChain.id)
  const [chainId, setChainId] = React.useState(defaultChainId)
  const chainName = ChainId.getName(chainId).toLowerCase()
  const vaults = vaultsByChain[chainId]

  useFetchPositionInfo(chainId, vaults)

  return (
    <>
      <div className={styles.header}>
        <NetworkSelector value={chainId} onChange={setChainId} />
      </div>
      <VaultTable vaults={vaults} chainName={chainName} />
    </>
  )
}

/**
 * Gets the user's invested position in each vault in the list.
 * @param chainId The ID of the currently selected chain.
 * @param vaults A list of vaults from which to get the position.
 */
function useFetchPositionInfo(chainId: ChainId, vaults: Vault[]) {
  const { wallet, chain, provider } = useWalletWrapperContext()
  const walletAddress = wallet?.address
  const multicallAddress = chain?.multicallAddress
  const dispatch = useAppDispatch()

  const callback = () => {
    if (!multicallAddress || !walletAddress || !provider || vaults.length === 0) {
      return
    }

    const endpoint = getRPCEndpoint(chainId)
    if (!endpoint) {
      return
    }

    void dispatch(
      fetchPositionInfo({
        walletAddress,
        vaultAddresses: vaults.map(vault => vault.address),
        multicallAddress,
        provider: new JsonRpcProvider(endpoint),
      }),
    )
  }

  React.useEffect(callback, [vaults, chainId, dispatch, provider, multicallAddress, walletAddress])
}
