import styles from './roadmap-date.module.scss'

export interface RoadmapDateProps {
  children: React.ReactNode
}

export function RoadmapDate({ children }: RoadmapDateProps) {
  return <div className={styles.roadmapDate}>
    <span>{children}</span>
  </div>
}

export default RoadmapDate
