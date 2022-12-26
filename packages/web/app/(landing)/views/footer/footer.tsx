import Link from "next/link";
import React from "react";
import IconDiscord from "../../../components/icons/icon-discord";
import IconGithub from "../../../components/icons/icon-github";
import IconMedium from "../../../components/icons/icon-medium";
import IconTelegram from "../../../components/icons/icon-telegram";
import IconTwitter from "../../../components/icons/icon-twitter";
import LogoWithText from "../../../components/logo/logo-with-text";

const getLinks = (
  prefix: string
): { key: string; name: string; href: string }[] => {
  return Object.keys(process.env)
    .filter((key) => key.startsWith(prefix))
    .map((key) => {
      const value = process.env[key] ?? "";
      const [name, href] = value.split(":");
      return {
        key: key.substring(prefix.length + 1).toLowerCase(),
        name,
        href,
      };
    });
};

const getPages = () => getLinks("NAVIGATION");

const getSocials = () => {
  const icons: Record<string, React.ReactNode> = {
    discord: <IconDiscord />,
    twitter: <IconTwitter />,
    github: <IconGithub />,
    telegram: <IconTelegram />,
    medium: <IconMedium />,
  };
  return getLinks("SOCIAL").map(({ key, ...rest }) => {
    return {
      icon: icons[key],
      ...rest,
    };
  });
};

const FooterLink = (props: {
  name: string;
  href: string;
  icon?: React.ReactNode;
}) => {
  const { name, href, icon } = props;
  return (
    <li key={name} className="flex items-center text-slate-300">
      {icon && <div className="translate-y-px">{icon}</div>}
      <Link className="ml-1 leading-7 hover:underline" href={href}>
        {name}
      </Link>
    </li>
  );
};

const Footer = () => {
  const pages = React.useMemo(getPages, []);
  const socials = React.useMemo(getSocials, []);

  return (
    <div className="w-full max-w-screen-lg p-8">
      <div className="flex justify-around">
        <div>
          <LogoWithText />
        </div>
        <div>
          <h5 className="mb-2 text-xl font-medium leading-normal">Resources</h5>
          <ul>
            {pages.map(({ name, href }) => (
              <FooterLink key={name} name={name} href={href} />
            ))}
          </ul>
        </div>
        <div>
          <h5 className="mb-2 text-xl font-medium leading-normal">Social</h5>
          {socials.map(({ name, href, icon }) => (
            <FooterLink key={name} name={name} href={href} icon={icon} />
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        Copyright © {new Date().getFullYear()}{" "}
        <span className="font-medium">Eonian Finance</span>
      </div>
    </div>
  );
};

export default Footer;
