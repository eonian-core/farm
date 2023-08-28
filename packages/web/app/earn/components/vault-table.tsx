import clsx from 'clsx'
import React from 'react'
import type { Vault } from '../../api'
import { InternalLink } from '../../components/links/links'
import { ScreenName, useScreenName } from '../../components/resize-hooks/screens'
import {
  VaultAPYCell,
  VaultIndexCell,
  VaultNameCell,
  VaultTagsCell,
  VaultYouPositionCell,
} from './cells'

import styles from './vault-table.module.scss'

interface Props {
  chainName: string
  vaults: Vault[]
}

interface Column {
  name: string
  render: (vault: Vault, index: number) => React.ReactNode
  align: 'left' | 'center'
  moveLinkBack?: boolean
}

const COLUMNS: Column[] = [
  {
    name: '#',
    render: (vault, index) => <VaultIndexCell index={index} />,
    align: 'left',
  },
  {
    name: 'Vault',
    render: vault => <VaultNameCell vault={vault} />,
    align: 'left',
  },
  {
    name: 'APY',
    render: vault => <VaultAPYCell vault={vault} />,
    align: 'center',
  },
  {
    name: 'Tags',
    render: vault => <VaultTagsCell vault={vault} />,
    align: 'center',
    moveLinkBack: true,
  },
  {
    name: 'Your position',
    render: vault => <VaultYouPositionCell vault={vault} />,
    align: 'center',
    moveLinkBack: true,
  },
]

export function VaultTable({ vaults, chainName }: Props) {
  const columns = useColumns()
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.name} className={styles[column.align]}>
                {column.name}
              </th>
            ))}
          </tr>
          <tr className={styles.divider} />
        </thead>
        <tbody>
          {vaults.map((vault, index) => (
            <VaultRow key={vault.address} vault={vault} index={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )

  function VaultRow(props: { vault: Vault; index: number; columns: Column[] }) {
    const { vault, index, columns } = props
    return (
      <tr key={vault.address}>
        {columns.map(column => (
          <td key={column.name} className={styles[column.align]}>
            <LinkOverlay vault={vault} moveBack={column.moveLinkBack} />
            <div className={styles.cell} onClick={clickLinkUnderneath}>
              {column.render(vault, index)}
            </div>
          </td>
        ))}
      </tr>
    )
  }

  function LinkOverlay(props: { vault: Vault; moveBack?: boolean }) {
    const { vault, moveBack } = props
    const href = `/earn/${chainName}/${vault.symbol}`
    const classNames = clsx(styles.link, { [styles.moveBack]: moveBack })
    return <InternalLink href={href} className={classNames} />
  }
}

function useColumns() {
  const screenName = useScreenName()
  switch (screenName) {
    case ScreenName.SMALL_MOBILE:
    case ScreenName.MOBILE:
      return COLUMNS.slice(1, 3)
    case ScreenName.TABLET:
      return COLUMNS.slice(1, -1)
    default:
      return COLUMNS
  }
}

function clickLinkUnderneath(event: React.MouseEvent) {
  const element = event.currentTarget as HTMLElement
  const display = window.getComputedStyle(element).display

  element.style.display = 'none'
  const { clientX: x, clientY: y } = event
  const elementAtPoint = document.elementFromPoint(x, y)
  element.style.display = display

  if (elementAtPoint && elementAtPoint.tagName.toLowerCase() === 'a') {
    const linkElement = elementAtPoint as HTMLLinkElement
    linkElement.click()
  }
}
