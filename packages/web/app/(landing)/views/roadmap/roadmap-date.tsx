import styles from './roadmap-date.module.scss';

export interface RoadmapDateProps {
  children: React.ReactNode;
}

export const RoadmapDate = ({ children }: RoadmapDateProps) => (
  <div className={styles.roadmapDate}>
    <span>{children}</span>
  </div>
);

export default RoadmapDate;
