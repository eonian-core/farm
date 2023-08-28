import React from 'react'
import { Collapse as NextUICollapse } from '@nextui-org/react'
import { useToId } from '../heading/to-id'
import { useLocationHash } from './use-location-hash'

import styles from './collapse.module.scss'

interface Props {
  title: string
  expanded: boolean
  children: React.ReactNode
}

export default function Collapse({ title, expanded, children }: Props) {
  const [isExpanded, setIsExpanded] = React.useState(expanded)

  const id = useToId(title)
  const hash = useLocationHash()

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (typeof hash !== 'string' || typeof id !== 'string') {
      return
    }
    if (id === hash) {
      setIsExpanded(true)
      scrollIntoView(ref)
    }
  }, [hash, id])

  return (
    <div id={id} ref={ref} className={styles.container}>
      <NextUICollapse expanded={isExpanded} shadow title={title}>
        {children}
      </NextUICollapse>
    </div>
  )
}

export function scrollIntoView(ref: React.RefObject<HTMLDivElement>) {
  ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
