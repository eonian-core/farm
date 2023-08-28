'use client'

import React from 'react'
import Button from '../button/button'
import { InternalLink } from '../links/links'
import { useWalletWrapperContext } from '../../providers/wallet/wallet-wrapper-provider'
import { WalletStatus } from '../../providers/wallet/wrappers/types'
import WalletInfo from './wallet-info'

function ConnectWallet() {
  const { status, connect } = useWalletWrapperContext()

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      void connect()
    },
    [connect],
  )

  return status === WalletStatus.CONNECTED
    ? (
    <WalletInfo />
      )
    : (
    <InternalLink href={'/earn'} onClick={handleClick}>
      <Button bordered>{status === WalletStatus.CONNECTING ? 'Connecting...' : 'Connect'}</Button>
    </InternalLink>
      )
}

export default ConnectWallet
