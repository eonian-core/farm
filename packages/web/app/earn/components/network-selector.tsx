import { Dropdown } from '@nextui-org/react'
import React from 'react'
import { useWalletWrapperContext } from '../../providers/wallet/wallet-wrapper-provider'
import { ChainId } from '../../providers/wallet/wrappers/helpers'

import styles from './network-selector.module.scss'

interface Props {
  value: ChainId
  onChange: (value: ChainId) => void
}

export const NetworkSelector: React.FC<Props> = ({ value, onChange }) => {
  const { chains } = useWalletWrapperContext()

  const chain = chains.find(({ id }) => id === value)!

  const handleSelectionChanged = React.useCallback(
    (keys: 'all' | Set<string | number>) => {
      const set = keys as Set<string>
      const [stringId] = Array.from(set)
      const chainId = ChainId.parse(stringId)
      onChange(chainId)
    },
    [onChange],
  )

  return (
    <Dropdown>
      <Dropdown.Button size="lg" css={{ background: '$dark' }}>
        <span className={styles.icon}>{chain.icon}</span>
        {chain.name}
      </Dropdown.Button>
      <Dropdown.Menu
        css={{ $$dropdownMenuWidth: '320px' }}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[String(chain.id)]}
        onSelectionChange={handleSelectionChanged}
      >
        {chains.map(chain => (
          <Dropdown.Item key={chain.id} icon={chain.icon}>
            {chain.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
