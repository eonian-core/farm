import styles from './gradient-card.module.scss';

export interface GradientCardProps {
    children: React.ReactNode;
}

export const GradientCard = ({ children }: GradientCardProps) => (
    <div className={styles.gradientCard}>
        <div className={styles.gradientWrapper}>
            <div className={`${styles.gradient} ${styles.gradient1}`}></div>
            <div className={`${styles.gradient} ${styles.gradient2}`}></div>
            <div className={`${styles.gradient} ${styles.gradient3}`}></div>
        </div>

        <div className={styles.contentWrapper}>
            <div className={styles.content}>
                <span>{children}</span>
            </div>
        </div>
    </div>
)