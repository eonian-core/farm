import clsx from 'clsx'
import FadeIn from '../../../components/fade-in/fade-in'
import styles from './roadmap-container.module.scss'

export interface RoadmapContainerProps {
  children: React.ReactNode
}

export function RoadmapContainer({ children }: RoadmapContainerProps) {
  return <FadeIn className={clsx(styles.roadmapContainer)} amount={0.3} fadeUpInitial="10%">
    {children}
  </FadeIn>
}

export default RoadmapContainer
