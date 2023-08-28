import React from 'react'
import type { Vault } from '../../../api'
import { calculateVaultAPY } from '../../../shared/projections/calculate-apy'

interface Props {
  vault: Vault
}

export const VaultAPYCell: React.FC<Props> = ({ vault }) => <div>{calculateVaultAPY(vault).toFixed(2)}%</div>
