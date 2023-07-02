import ExternalLink from "./external-link";
import { InternalLink, LinkWithIconProps } from "./links"
import styles from './links.module.scss';
import { WrapperLink } from "./wrapper-link";

/** Link which can be usede in text */
export const LinkInText = ({...props}: LinkWithIconProps) => {
    return <WrapperLink className={styles.linkInText} {...props} />
}