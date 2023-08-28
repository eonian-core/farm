import { Badge } from '@nextui-org/react'
import React from 'react'
import type { Vault } from '../../../api'
import IconCoin from '../../../components/icons/icon-coin'
import { toStringNumberFromDecimals } from '../../../shared'
import { CellWithDescription } from './cell-with-description'

import styles from './vault-name-cell.module.scss'

interface Props {
  vault: Vault
}

const TVL_THRESHOLD = 1e4

export const VaultNameCell: React.FC<Props> = ({ vault }) => {
  const currentTVL = +toStringNumberFromDecimals(vault.fundAssetsUSD, vault.asset.price.decimals)
  return (
    <CellWithDescription icon={<IconCoin symbol={vault.asset.symbol} width="1.75em" height="1.75em" />}>
      <div className={styles.name}>
        {vault.asset.symbol}
        {currentTVL < TVL_THRESHOLD && (
          <Badge disableOutline size="xs" variant="flat">
            NEW
          </Badge>
        )}
      </div>
    </CellWithDescription>
  )
}
