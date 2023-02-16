import React from "react";
import LogoWithText from "../logo/logo-with-text";
import { useLocalSocials } from "../../socials";
import styles from './footer.module.scss'
import clsx from "clsx";
import { Resources } from "./resources";
import { Socials } from "./socials";


const Footer = () => {
  const socials = useLocalSocials()

  return (
    <footer className={clsx("w-full max-w-screen-lg p-8 pt-14", styles.footer)}>
      <div className="flex flex-wrap justify-center md:justify-around">
        <div className={`${styles.logoSection} p-4`}>
          <LogoWithText />
          <div className={styles.sign}>Hand-crafted with <span className={styles.heart}>❤️</span> by our team</div>
        </div>

        <div className="flex flex-wrap p-4 md:justify-start md:align-start">
          <Resources />

          <Socials {...{ socials }} />
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


