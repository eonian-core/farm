import clsx from 'clsx'
import type { LinkWithIconProps } from './links'
import { LinkWithIcon } from './links'
import styles from './links.module.scss'

function ExternalLink({ href, className, ...props }: LinkWithIconProps) {
  return <LinkWithIcon
    href={href}
    target="_blank"
    rel="noopener noreferrer" // prevent tabnabbing
    className={clsx(styles.externalLink, className)}
    {...props}
  />
}

export default ExternalLink
