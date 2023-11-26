'use client'
import React from 'react'
import { Tooltip } from '@nextui-org/react'
import type { Vault } from '../../../api'
import IconExternal from '../../../components/icons/icon-external'
import ExternalLink from '../../../components/links/external-link'
import type { ChainId } from '../../../providers/wallet/wrappers/helpers'
import { getChainExplorer } from '../../../providers/wallet/wrappers/helpers'
import styles from './vault-link.module.scss'

interface Props {
  vault: Vault
  chainId: ChainId
}

export function VaultLink({ vault, chainId }: Props) {
  const href = getChainExplorer(chainId)
  if (!href) {
    return <VaultLinkContent vault={vault} />
  }

  return (
    <ExternalLink
      className={styles.vaultLink}
      icon={<IconExternal />}
      iconAtEnd
      href={`${href}address/${vault.address}`}
    >
      <VaultLinkContent vault={vault} />
    </ExternalLink>
  )
}

export function VaultLinkContent({ vault }: { vault: Vault }) {
  return <Tooltip content={`${vault.name} (${vault.symbol})`}>Vault Smart Contract</Tooltip>
}
