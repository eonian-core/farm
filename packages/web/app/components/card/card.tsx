import { Inter } from '@next/font/google'
import styles from './card.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function ButtonBlock({href}: {href: string}) {
  return (
    <a
      href={href}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className={inter.className}>
        Docs <span>-&gt;</span>
      </h2>
      <p className={inter.className}>
        Find in-depth information about Next.js features and API.
      </p>
    </a>
  )
}