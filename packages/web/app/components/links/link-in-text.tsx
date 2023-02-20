import ExternalLink from "./external-link";
import { InternalLink, LinkWithIconProps } from "./links"
import styles from './links.module.scss';

/** Link which can be usede in text */
export const LinkInText = ({href, ...props}: LinkWithIconProps) => {
    if(href.toString().startsWith('/')) {
        return <InternalLink href={href} className={styles.linkInText} {...props} />
    }

    return <ExternalLink href={href} className={styles.linkInText} {...props} />
}