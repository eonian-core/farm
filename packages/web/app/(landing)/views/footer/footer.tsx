import Link from "next/link";
import React from "react";
import LogoWithText from "../../../components/logo/logo-with-text";
import socials from "./socials";

const FooterLink = (props: {
  name: string;
  href?: string;
  hrefs?: Record<string, string>;
  icon?: React.ReactNode;
}) => {
  const { name, href, hrefs, icon } = props;
  const links = hrefs ? hrefs : { en: href ?? "" };
  const langauges = Object.keys(links);
  return (
    <li key={name} className="flex items-center text-slate-300">
      {icon && <div className="translate-y-px">{icon}</div>}
      {langauges.map((langauge, index) => {
        const href = links[langauge];
        const lang = langauge.toUpperCase();
        const total = langauges.length;
        return (
          <React.Fragment key={langauge}>
            <Link
              className="ml-1 leading-7 hover:underline"
              target={href.startsWith("/") ? "_self" : "_blank"}
              href={href}
            >
              {total > 1 ? (index === 0 ? `${name} ${lang}` : lang) : name}
            </Link>
            {index < total - 1 ? "," : null}
          </React.Fragment>
        );
      })}
    </li>
  );
};

const Footer = () => {
  return (
    <div className="w-full max-w-screen-lg p-8">
      <div className="flex flex-wrap justify-center md:justify-around">
        <div className="p-4">
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
    </div>
  );
};

export default Footer;
