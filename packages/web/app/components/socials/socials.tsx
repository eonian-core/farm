import clsx from 'clsx'
import ExternalLink from '../links/external-link'
import type { SocialLink } from '../../socials'

import styles from './socials.module.scss'

export function Socials({ socials, highlight }: { socials: Array<SocialLink>; highlight?: boolean }) {
  return <div
    className={clsx(styles.container, {
      [styles.highlight]: highlight,
    })}
  >
    <ul className={styles.socials}>
      {socials.map(({ name, href, icon }) => (
        <li key={name}>
          <ExternalLink href={href} icon={icon} />
        </li>
      ))}
    </ul>
  </div>
}
