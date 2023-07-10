import * as features from "../../features";
import IconExternal from "../icons/icon-external";
import ExternalLink from "../links/external-link";
import { InternalLink } from "../links/links";
import styles from "./footer.module.scss";

export interface ResourceItem {
  href: string;
  label: string;
  external?: boolean;
}

const list: Array<ResourceItem> = [
  { href: "/community", label: "Community", isEnabled: features.showCommunity },
  { href: "/faq", label: "FAQ", isEnabled: features.showFaq },
  { href: "/mission", label: "Mission", isEnabled: features.showMission },
  { href: "/security", label: "Security", isEnabled: features.showSecurity },
  { href: "/earn", label: "Earn", isEnabled: features.showEarn },
  {
    href: "https://leovs09.notion.site/Privacy-Policy-3ab03daeee044cabac8b27753c464743",
    label: "Privacy Policy",
    isEnabled: features.showPrivacyPolicy,
    external: true,
  },
  {
    href: "https://leovs09.notion.site/Terms-of-Service-360ed9bd7f4241d19fbf45e095157ea0",
    label: "Terms of Service",
    isEnabled: features.showTOS,
    external: true,
  },
].filter(({ isEnabled }) => isEnabled);

export const Resources = () => {
  // if at least one feautre is enabled, the footer resources will be shown
  if (!list.length) 
    return null;
  

  return (
    <div className={styles.linksSection}>
      <h5>Resources</h5>
      <ul>
        {list.map(({ href, label, external }) => (
          <li key={href}>
            {external ? (
              <ExternalLink icon={<IconExternal />} iconAtEnd href={href}>
                {label}
              </ExternalLink>
            ) : (
              <InternalLink href={href}>{label}</InternalLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
