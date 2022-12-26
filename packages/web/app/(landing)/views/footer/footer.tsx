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
      const [name, href] = value.split("@");
      return {
        key: key.substring(prefix.length + 1).toLowerCase(),
        name,
        href,
      };
    });
};

const getPages = () => getLinks("NAVIGATION");

interface MultiLangLink {
  name: string;
  hrefs: Record<string, string>;
  icon?: React.ReactNode;
}

const getSocials = () => {
  const icons: Record<string, React.ReactNode> = {
    discord: <IconDiscord />,
    twitter: <IconTwitter />,
    github: <IconGithub />,
    telegram: <IconTelegram />,
    medium: <IconMedium />,
  };
  return getLinks("SOCIAL").reduce((result, { key: rawKey, name, href }) => {
    const keyParts = rawKey.split("_");
    const key = keyParts[0];
    const language = keyParts[1]?.toLowerCase() ?? "en";

    if (!result[key]) {
      result[key] = {
        icon: icons[key],
        name,
        hrefs: {
          [language]: href,
        },
      };
    } else {
      result[key].hrefs[language] = href;
    }
    return result;
  }, {} as Record<string, MultiLangLink>);
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

const FooterMultiLangLink = ({ name, hrefs, icon }: MultiLangLink) => {
  const langauges = Object.keys(hrefs);
  return (
    <li key={name} className="flex items-center text-slate-300">
      {icon && <div className="translate-y-px">{icon}</div>}
      {langauges.map((langauge, index) => {
        const href = hrefs[langauge];
        const lang = langauge.toUpperCase();
        const total = langauges.length;
        return (
          <React.Fragment key={langauge}>
            <Link className="ml-1 leading-7 hover:underline" href={href}>
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
  const pages = React.useMemo(getPages, []);
  const socials = React.useMemo(getSocials, []);

  return (
    <div className="w-full max-w-screen-lg p-8">
      <div className="flex justify-around">
        <div>
          <LogoWithText />
          <div className="mt-4">Hand-crafted with ❤️ by our team</div>
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
          {Object.values(socials).map(FooterMultiLangLink)}
        </div>
      </div>
      <div className="mt-6 text-center">
        Copyright &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium">Eonian Finance</span>
      </div>
    </div>
  );
};

export default Footer;
