import * as features from "../../features";

export interface NavigationItem {
  href: string;
  label: string;
}

export const links = [
  features.showMission && { href: "/mission", label: "Mission" },
  features.showFaq && { href: "/faq", label: "FAQ" },
  features.showCommunity && { href: "/community", label: "Community" },
  features.showSecurity && { href: "/security", label: "Security" },
  features.showEarn && { href: "/earn", label: "Earn" },
].filter(Boolean) as Array<NavigationItem>;

export const mobileLinks: Array<NavigationItem> = [
  { href: "/", label: "Home" },
  ...links,
];
