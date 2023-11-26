import React from 'react'
import FadeInChildList from '../../../components/fade-in/fade-in-child-list'
import styles from './founders-list.module.scss'

interface Props {
  children: React.ReactNode
}

const FoundersList: React.FC<Props> = ({ children }) => (
  <ul className={styles.container}>
    <FadeInChildList initialDelay={0.3} delay={0.1}>
      {children}
    </FadeInChildList>
  </ul>
)

export default FoundersList
