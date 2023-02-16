import { SocialLink } from "../../socials";
import ExternalLink from "../links/external-link";
import styles from './footer.module.scss'

export const Socials = ({ socials }: { socials: Array<SocialLink> }) => (
    <div className="mx-12 mb-6">
      <h5 className="text-xl font-medium leading-normal">Social</h5>
  
      <ul className={styles.socials}>{
  
        socials.map(({ name, href, icon }) => (
          <li key={name}><ExternalLink href={href} icon={icon} /></li>
        ))
  
      }</ul>
    </div>
  )
  