import * as features from "../../features";
import { InternalLink } from "../links/links";
import styles from './footer.module.scss'

export interface ResourceItem {
    href: string;
    label: string;
}

const list: Array<ResourceItem> = [
    { href: "/community", label: "Community", isEnabled: features.showCommunity },
    { href: "/faq", label: "FAQ", isEnabled: features.showFaq },
    { href: "/mission", label: "Mission", isEnabled: features.showMission },
    { href: "/security", label: "Security", isEnabled: features.showSecurity },
]
    .filter(({ isEnabled }) => isEnabled)

export const Resources = () => {

    // if at least one feautre is enabled, the footer resources will be shown
    if (!list.length) {
        return null;
    }

    return (
        <div className={styles.linksSection}>
            <h5>Resources</h5>
            <ul>
                {list.map(({ href, label }) => (
                    <li key={href}>
                        <InternalLink href={href}>{label}</InternalLink>
                    </li>
                ))}

            </ul>
        </div>
    )
}
