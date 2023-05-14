"use client";

import Link, { LinkProps as NextLinkProps } from "next/link";
import React, { useCallback } from "react";
import clsx from "clsx";
import styles from "./links.module.scss";
import useScrollToTop from "./useScrollToTop";
import { useAppDispatch } from "../../store/hooks";
import { setPageLoading } from "../../store/slices/navigationSlice";

export type BaseLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>;

/** Props for link which can contain optional icon */
export type LinkWithIconProps = BaseLinkProps & {
  /** Can be omited if link must contain only text */
  icon?: React.ReactNode;
  /** Can be omited if link must contain only icon */
  children?: React.ReactNode;
  /** Class name for icon */
  iconClassName?: string;
};

/** Link which can contain optional icon */
export const LinkWithIcon = ({
  href,
  className,
  icon,
  children,
  iconClassName,
  ...props
}: LinkWithIconProps) => (
  <Link
    href={href}
    className={clsx(
      styles.linkWithIcon,
      {
        [styles.onlyIcon]: !children,
        [styles.onlyText]: !icon,
      },
      className
    )}
    {...props}
  >
    {icon && <span className={clsx(styles.icon, iconClassName)}>{icon}</span>}
    {children}
  </Link>
);

/** Link used for navigation between pages **inside** application */
export const InternalLink = ({
  href,
  className,
  onClick,
  ...props
}: LinkWithIconProps) => {
  const dispatch = useAppDispatch();
  const [onRouteChange] = useScrollToTop();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        href && dispatch(setPageLoading(href.toString()));
        onRouteChange();
      }
    },
    [onClick, onRouteChange, dispatch, href]
  );

  return (
    <LinkWithIcon
      href={href}
      className={clsx(styles.internalLink, className)}
      onClick={handleClick}
      {...props}
    />
  );
};
