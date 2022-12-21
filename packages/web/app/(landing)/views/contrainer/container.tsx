import styles from './container.module.scss'

export default function Container({children}: {children: any}) {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}