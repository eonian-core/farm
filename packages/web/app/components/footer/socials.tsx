import type { SocialLink } from '../../socials'
import ExternalLink from '../links/external-link'
import styles from './footer.module.scss'

export function Socials({ socials }: { socials: Array<SocialLink> }) {
  return <div className={styles.linksSection}>
    <h5>Social</h5>

    <ul className={styles.socials}>
      {socials.map(({ name, href, icon }) => (
        <li key={name}>
          <ExternalLink href={href} icon={icon} />
        </li>
      ))}
    </ul>
  </div>
}
