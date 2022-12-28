import React from "react";
import LogoWithText from "../logo/logo-with-text";
import FooterLink from "./footer-link";
import socials from "../../socials";
import styles from './footer.module.scss'

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-lg p-8 pt-14">
      <div className="flex flex-wrap justify-center md:justify-around">
        <div className={`${styles.logoSection} p-4`}>
          <LogoWithText />
          <div className="mt-2">Hand-crafted with ❤️ by our team</div>
        </div>

        <div className="flex flex-wrap p-4 md:justify-start md:align-start">
          <Resources />

          <div className="mx-12 mb-6">
            <h5 className="mb-2 text-xl font-medium leading-normal">Social</h5>
            <ul>{socials.map(FooterLink)}</ul>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        Copyright &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium">Eonian Finance</span>
      </div>
    </footer>
  );
};

export default Footer;

export const Resources = () => {
  const showFooter = process.env.NEXT_PUBLIC_FEATURE_SHOW_FAQ === 'true';
  // Additional features can be chhecked there
  // if at least one feautre is enabled, the footer will be shown
  if(!showFooter) {
    return null;
  }

  return (
    <div className="mx-12 mb-6">
      <h5 className="mb-2 text-xl font-medium leading-normal">
        Resources
      </h5>
      <ul>
        {showFooter && (
          <FooterLink name="FAQ" href="/faq" /> 
        )}
      </ul>
    </div>
  )
}