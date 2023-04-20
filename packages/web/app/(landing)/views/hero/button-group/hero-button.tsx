"use client";

import React from "react";
import { useIsDesktopOrSmaller } from "../../../../components/resize-hooks/screens";
import ExternalLink from "../../../../components/links/external-link";
import Button, {
  Props as ButtonProps,
} from "../../../../components/button/button";

import styles from "./hero-button.module.scss";

interface Props extends ButtonProps {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
}

const HeroButton: React.FC<Props> = ({
  children,
  href,
  icon,
  ...restProps
}) => {
  const isDesktop = useIsDesktopOrSmaller();

  return (
    <ExternalLink className={styles.button} href={href}>
      <Button size={isDesktop ? "md" : "lg"} icon={icon} dark wide {...restProps}>
        {children}
      </Button>
    </ExternalLink>
  );
};

export default HeroButton;
