import clsx from "clsx";
import * as React from "react";
import { InternalLink, LinkWithIconProps } from "../links/links";
import styles from "./navigation.module.scss";
import { usePathname } from "next/navigation";

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
