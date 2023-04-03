"use client";

import { Button, ButtonProps } from "@nextui-org/react";
import React from "react";
import { useIsDesktopOrSmaller } from "../../../../components/resize-hooks/screens";
import IconDiscord from "../../../../components/icons/icon-discord";
import ExternalLink from "../../../../components/links/external-link";
import FadeIn from "../../../../components/fade-in/fade-in";

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
    <FadeIn>
      <ExternalLink href={href}>
        <Button
          size={isDesktop ? "md" : "lg"}
          css={{ color: "var(--nextui-colors-primarySolidContrast)" }}
          auto
          iconRight={icon}
          {...restProps}
        >
          {children}
        </Button>
      </ExternalLink>
    </FadeIn>
  );
};

export default HeroButton;
