import type { PropsWithChildren } from 'react'
import styles from './who-are-we.module.scss'

export const Name = ({ children }: PropsWithChildren) => <div className={styles.name}>{children}</div>

export default Name
