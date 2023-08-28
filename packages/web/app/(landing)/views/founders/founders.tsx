import React from 'react'
import FadeInList from '../../../components/fade-in/fade-in-list'
import { useIsMobileOrSmaller } from '../../../components/resize-hooks/screens'
import styles from './founders.module.scss'

interface Props {
  children: React.ReactNode
}

const Founders: React.FC<Props> = ({ children }) => {
  const isMobileOrSmaller = useIsMobileOrSmaller()

  return (
    <FadeInList className={styles.container} amount={!isMobileOrSmaller ? 0.3 : 0.2} initialDelay={0} delay={0.2}>
      {children}
    </FadeInList>
  )
}

export default Founders
