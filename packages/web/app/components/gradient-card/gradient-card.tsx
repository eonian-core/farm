import styles from './gradient-card.module.scss'

export interface GradientCardProps {
  children: React.ReactNode
}

export function GradientCard({ children }: GradientCardProps) {
  return <div className={styles.gradientCard}>
    <div className={styles.gradientWrapper}>
      <div className={`${styles.gradient} ${styles.gradient1}`}></div>
      <div className={`${styles.gradient} ${styles.gradient2}`}></div>
      <div className={`${styles.gradient} ${styles.gradient3}`}></div>
    </div>

    <div className={styles.contentWrapper}>
      <div className={styles.content}>{children}</div>
    </div>
  </div>
}
