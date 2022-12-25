import styles from './container.module.scss'

export default function Container({children}: {children: any}) {
    return (
        <section className={styles.container}>
            {children}
        </section>
    )
}