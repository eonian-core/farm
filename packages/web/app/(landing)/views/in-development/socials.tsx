import ExternalLink from "../../../components/links/external-link";
import { SocialLink } from "../../../socials";

import styles from "./socials.module.scss";

export const Socials = ({ socials }: { socials: Array<SocialLink> }) => (
    <div className={styles.container}>
      <ul className={styles.socials}>{
  
        socials.map(({ name, href, icon }) => (
          <li key={name}><ExternalLink href={href} icon={icon} /></li>
        ))
  
      }</ul>
    </div>
  )
  