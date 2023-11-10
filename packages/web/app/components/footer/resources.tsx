import type { ResourceItem } from '../../features'
import { ResourcesLinks } from '../../features'
import IconExternal from '../icons/icon-external'
import ExternalLink from '../links/external-link'
import { InternalLink } from '../links/links'
import styles from './footer.module.scss'

const list: Array<ResourceItem> = Object.values(ResourcesLinks).filter(({ isEnabled }) => isEnabled)

export function Resources() {
  // if at least one feautre is enabled, the footer resources will be shown
  if (!list.length) {
    return null
  }

  return (
    <div className={styles.linksSection}>
      <h5>Resources</h5>
      <ul>
        {list.map(({ href, label, external }) => (
          <li key={href}>
            {external
              ? (
                <ExternalLink icon={<IconExternal />} iconAtEnd href={href}>
                  {label}
                </ExternalLink>
                )
              : (
                <InternalLink href={href}>{label}</InternalLink>
                )}
          </li>
        ))}
      </ul>
    </div>
  )
}
