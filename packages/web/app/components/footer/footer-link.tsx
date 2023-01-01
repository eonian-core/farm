import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface Props {
  name: string;
  href?: string;
  hrefs?: Record<string, string>;
  icon?: React.ReactNode;
}

const FooterLink: React.FC<Props> = ({ name, href, hrefs, icon }) => {
  const links = hrefs ? hrefs : { en: href ?? "" };
  const langauges = Object.keys(links);
  return (
    <li key={name} className="flex items-center text-slate-300 mb-2">
      {icon && <div>{icon}</div>}
      {langauges.map((langauge, index) => {
        const href = links[langauge];
        const lang = langauge.toUpperCase();
        const total = langauges.length;

        const isExternalLink = href.startsWith("/");

        return (
          <React.Fragment key={langauge}>
            <Link
              className={clsx("leading-7 hover:underline", { 'ml-1': !isExternalLink})}
              target={isExternalLink ? "_self" : "_blank"}
              rel={isExternalLink ? '' : "noopener noreferrer"} // prenect tabnabbing
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

export default FooterLink;
