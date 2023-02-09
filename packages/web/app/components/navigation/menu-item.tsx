import clsx from "clsx";
import * as React from "react";
import { InternalLink, LinkWithIconProps } from "../links/links";
import styles from "./navigation.module.scss";


export const MenuItem = ({ className, ...props }: LinkWithIconProps) => (
    <li className={clsx(styles.menuItem, className)}>
        <InternalLink {...props} />
    </li>
);

