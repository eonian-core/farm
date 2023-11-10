// This file is used to enable/disable features in the app

export const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true'
export const showFaq = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true'
export const showMission = process.env.NEXT_PUBLIC_FEATURE_MISSION_PAGE === 'true'
export const showSecurity = process.env.NEXT_PUBLIC_FEATURE_SECURITY_PAGE === 'true'
export const showEarn = process.env.NEXT_PUBLIC_FEATURE_EARN_PAGE === 'true'
export const showTOS = process.env.NEXT_PUBLIC_FEATURE_TOS_PAGE === 'true'
export const showPrivacyPolicy = process.env.NEXT_PUBLIC_FEATURE_PP_PAGE === 'true'
export const showDocs = process.env.NEXT_PUBLIC_FEATURE_DOCS_PAGE === 'true'
export const showRoadmap = process.env.NEXT_PUBLIC_FEATURE_ROADMAP_PAGE === 'true'

export interface ResourceItem {
  href: string
  label: string
  external?: boolean
  isEnabled?: boolean
}

export interface ResourceMap {
  [key: string]: ResourceItem
}

export const ResourcesLinks: ResourceMap = {
  Mission: { href: '/mission', label: 'Mission', isEnabled: showMission },
  Roadmap: { href: '/roadmap', label: 'Roadmap', isEnabled: showRoadmap },
  Community: { href: '/community', label: 'Community', isEnabled: showCommunity },
  Security: { href: '/security', label: 'Security', isEnabled: showSecurity },
  Earn: { href: '/earn', label: 'Earn', isEnabled: showEarn },
  FAQ: { href: '/faq', label: 'FAQ', isEnabled: showFaq },
  Docs: {
    href: 'https://leovs09.notion.site/465899d944244e9cb55e5dea502efd47',
    label: 'Docs',
    isEnabled: showDocs,
    external: true,
  },
  PrivacyPolicy: {
    href: 'https://leovs09.notion.site/Privacy-Policy-3ab03daeee044cabac8b27753c464743',
    label: 'Privacy Policy',
    isEnabled: showPrivacyPolicy,
    external: true,
  },
  TOS: {
    href: 'https://leovs09.notion.site/Terms-of-Service-360ed9bd7f4241d19fbf45e095157ea0',
    label: 'Terms of Service',
    isEnabled: showTOS,
    external: true,
  },
}
