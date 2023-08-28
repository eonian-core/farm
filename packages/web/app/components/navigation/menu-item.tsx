import clsx from 'clsx'
import * as React from 'react'
import { usePathname } from 'next/navigation'
import type { LinkWithIconProps } from '../links/links'
import { InternalLink } from '../links/links'

import { Socials } from '../socials/socials'
import { useLocalSocials } from '../../socials'
import IconExternal from '../icons/icon-external'
import ExternalLink from '../links/external-link'
import styles from './navigation.module.scss'

export function MenuItem({ className, ...props }: LinkWithIconProps) {
  const pathname = usePathname()

  const href = props.href.toString()
  const isExternal = !href.startsWith('/')
  const isActive = !isExternal && pathname.startsWith(href)

  return (
    <li
      className={clsx(styles.menuItem, className, {
        [styles.menuItemActive]: isActive,
      })}
    >
      {isExternal
        ? (
        <ExternalLink icon={<IconExternal size="1em" />} iconAtEnd {...props} />
          )
        : (
        <InternalLink {...props} />
          )}
    </li>
  )
}

export function SocialMenuItem() {
  const socials = useLocalSocials()

  return (
    <li className={styles.menuItem}>
      <Socials socials={socials} highlight />
    </li>
  )
}
