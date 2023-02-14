import * as features from "../../features";


export interface NavigationItem {
    href: string,
    label: string
}

export const links = [
    features.showCommunity && { href: '/community', label: 'Community' },
    features.showFaq && { href: '/faq', label: 'FAQ' },
    features.showMission && { href: '/mission', label: 'Mission' },
].filter(Boolean) as Array<NavigationItem>;

export const mobileLinks: Array<NavigationItem> = [
    { href: '/', label: 'Home' },
    ...links
]
