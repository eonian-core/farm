import { Roboto } from '@next/font/google'
import styles from './navigation.module.scss'
import Link from 'next/link'

const roboto = Roboto({ subsets: ['latin'] , weight: ['500']})

export default function Navigation() {
    return (
        <nav className={styles.navigation}>
            <ul className={styles.content}>
                <li className={styles.logo}>
                    <Link href="/" className={roboto.className}><span>Eonian</span></Link>
                </li>
            </ul>            
        </nav>
    )
}