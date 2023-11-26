import Container from '../../../components/contrainer/container'
import FadeInList from '../../../components/fade-in/fade-in-list'
import { useIsTabletOrSmaller } from '../../../components/resize-hooks/screens'
import InDevelopmentParallax from './in-development-parallax'
import styles from './in-development.module.scss'

interface ContainerProps {
  /** content of the block, expected to have: h2, p  and Card elements */
  children: React.ReactNode
}

export function InDevelopment({ children }: ContainerProps) {
  const isTabletOrSmaller = useIsTabletOrSmaller()

  return (
    <Container className={styles.pageContainer}>
      <div className={styles.inDevelopmentWrapper}>
        <InDevelopmentParallax />

        <FadeInList
          className={styles.inDevelopment}
          childClassName={styles.inDevelopmentChild}
          amount={isTabletOrSmaller ? 0.3 : 0.8}
          initialDelay={0}
        >
          {children}
        </FadeInList>
      </div>
    </Container>
  )
}

export default InDevelopment
