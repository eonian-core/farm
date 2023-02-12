import * as features from "../../features";
import { InternalLink } from "../links/links";

export interface ResourceItem {
    href: string;
    label: string;
}

const list: Array<ResourceItem> = [
    { href: "/community", label: "Community", isEnabled: features.showCommunity },
    { href: "/faq", label: "FAQ", isEnabled: features.showFaq },
    { href: "/about", label: "About", isEnabled: features.showAbout },
]
    .filter(({ isEnabled }) => isEnabled)

export const Resources = () => {

    // if at least one feautre is enabled, the footer resources will be shown
    if (!list.length) {
        return null;
    }

    return (
        <div className="mx-12 mb-6">
            <h5 className="text-xl font-medium leading-normal">
                Resources
            </h5>
            <ul>
                {list.map(({ href, label }, index) => (
                    <li key={href}>
                        <InternalLink href={href} >{label}</InternalLink>
                    </li>
                ))}

            </ul>
        </div>
    )
}