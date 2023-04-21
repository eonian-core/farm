import ExternalLink from "../links/external-link";
import { SocialLink } from "../../socials";

import styles from "./socials.module.scss";
import clsx from "clsx";

export const Socials = ({ socials, highlight }: { socials: Array<SocialLink>, highlight?: boolean}) => (
    <div className={clsx(styles.container, {
      [styles.highlight]: highlight
    })}>
      <ul className={styles.socials}>{
  
        socials.map(({ name, href, icon }) => (
          <li key={name}><ExternalLink href={href} icon={icon} /></li>
        ))
  
      }</ul>
    </div>
  )
  