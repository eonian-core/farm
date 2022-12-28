import React from "react";
import LogoWithText from "../../../components/logo/logo-with-text";
import FooterLink from "./footer-link";
import socials from "./socials";

const Footer = () => {
  return (
    <footer className="w-full max-w-screen-lg p-8">
      <div className="flex flex-wrap justify-center md:justify-around">
        <div className="flex flex-col items-center p-4 md:items-start">
          <LogoWithText />
          <div className="mt-4">Hand-crafted with ❤️ by our team</div>
        </div>
        <div className="flex flex-wrap p-4 md:justify-around">
          <div className="mx-12 mb-6">
            <h5 className="mb-2 text-xl font-medium leading-normal">
              Resources
            </h5>
            <ul>
              <FooterLink name="FAQ" href="/faq" />
            </ul>
          </div>
          <div className="mx-12 mb-6">
            <h5 className="mb-2 text-xl font-medium leading-normal">Social</h5>
            {socials.map(FooterLink)}
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
