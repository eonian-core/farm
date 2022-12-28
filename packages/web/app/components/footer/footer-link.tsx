import Link from "next/link";
import React from "react";

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

export default FooterLink;
