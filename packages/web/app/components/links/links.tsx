import Link, { LinkProps as NextLinkProps } from "next/link";
import React from "react";
import clsx from "clsx";
import styles from './links.module.scss';

export type BaseLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & NextLinkProps & {
    children?: React.ReactNode;
} & React.RefAttributes<HTMLAnchorElement>

/** Props for link which can contain optional icon */
export type LinkWithIconProps = BaseLinkProps & {
    /** Can be omited if link must contain only text */
    icon?: React.ReactNode;
    /** Can be omited if link must contain only icon */
    children?: React.ReactNode;

    /** Class name for icon */
    iconClassName?: string
}

/** Link which can contain optional icon */
export const LinkWithIcon = ({ href, className, icon, children, iconClassName, ...props }: LinkWithIconProps) => (
    <Link 
        href={href} 
        className={clsx(styles.linkWithIcon, {
            [styles.onlyIcon]: !children,
            [styles.onlyText]: !icon,
        }, className)} 
        {...props}
    >
        {icon && <span className={clsx(styles.icon, iconClassName)}>{icon}</span>}
        {children}
    </Link>
);

/** Link used for navigation between pages **inside** application */
export const InternalLink = ({ href, className, ...props }: LinkWithIconProps) => (
    <LinkWithIcon href={href} className={clsx(styles.internalLink, className)} {...props} />
);

/** Link used for navigation to **external** sites */
export const ExternalLink = ({ href, className, ...props }: LinkWithIconProps) => (
    <LinkWithIcon
        href={href}
        target="_blank"
        rel="noopener noreferrer" // prevent tabnabbing
        className={clsx(styles.externalLink, className)}
        {...props}
    />
);

