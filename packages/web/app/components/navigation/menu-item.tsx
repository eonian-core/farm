import clsx from "clsx";
import * as React from "react";
import { usePathname } from "next/navigation";
import { InternalLink, LinkWithIconProps } from "../links/links";
import styles from "./navigation.module.scss";

import { Socials } from '../socials/socials';
import { useLocalSocials } from "../../socials";

export const MenuItem = ({ className, ...props }: LinkWithIconProps) => {
  const pathname = usePathname();
  return (
    <li
      className={clsx(styles.menuItem, className, {
        [styles.menuItemActive]: props.href === pathname,
      })}
    >
      <InternalLink {...props} />
    </li>
  );
};


export const SocialMenuItem = () => {
  const socials = useLocalSocials()

  return (
    <li className={styles.menuItem}>
      <Socials socials={socials} highlight/>
    </li>
  );
};
