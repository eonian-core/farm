import { Badge } from '@nextui-org/react'
import React from 'react'
import type { Vault } from '../../../api'

import styles from './vault-tags-cell.module.scss'

interface Props {
  vault: Vault
}

export const VaultTagsCell: React.FC<Props> = () => (
  <div className={styles.container}>
    <Badge variant="flat" disableOutline>
      VFT
    </Badge>
    <Badge variant="flat" disableOutline>
      Stable
    </Badge>
    <Badge variant="flat" disableOutline>
      Low risk
    </Badge>
  </div>
)
