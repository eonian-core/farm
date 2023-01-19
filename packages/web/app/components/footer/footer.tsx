import React from "react";
import LogoWithText from "../logo/logo-with-text";
import globalSocials, {SocialLink} from "../../socials";
import styles from './footer.module.scss'
import { InternalLink } from "../links/links";
import clsx from "clsx";
import ExternalLink from "../links/external-link";

const Footer = ({ locale }: { locale: string }) => {
  return (
    <footer className={clsx("w-full max-w-screen-lg p-8 pt-14", styles.footer)}>
      <div className="flex flex-wrap justify-center md:justify-around">
        <div className={`${styles.logoSection} p-4`}>
          <LogoWithText />
          <div className={styles.sign}>Hand-crafted with <span className={styles.heart}>❤️</span> by our team</div>
        </div>

        <div className="flex flex-wrap p-4 md:justify-start md:align-start">
          <Resources />

          <Socials socials={globalSocials[locale]} />
        </div>
      </div>

      <div className={styles.copyright}>
        Copyright &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium">Eonian Finance</span>
      </div>
    </footer>
  );
};

export default Footer;

export const Resources = () => {
  const showFooter = process.env.NEXT_PUBLIC_FEATURE_FAQ_PAGE === 'true';
  const showCommunity = process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_PAGE === 'true';

  // if at least one feautre is enabled, the footer resources will be shown
  if (![showFooter, showCommunity].some(Boolean)) {
    return null;
  }

  return (
    <div className="mx-12 mb-6">
      <h5 className="text-xl font-medium leading-normal">
        Resources
      </h5>
      <ul>
        {showFooter && (
          <li><InternalLink href="/faq" >FAQ</InternalLink></li>
        )}
        {showCommunity && (
          <li><InternalLink href="/community" >Community</InternalLink></li>
        )}
      </ul>
    </div>
  )
}

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
