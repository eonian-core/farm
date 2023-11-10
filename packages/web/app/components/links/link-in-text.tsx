import type { LinkWithIconProps } from './links'
import styles from './links.module.scss'
import { WrapperLink } from './wrapper-link'

/** Link which can be usede in text */
export const LinkInText = ({ ...props }: LinkWithIconProps) => <WrapperLink className={styles.linkInText} {...props} />
