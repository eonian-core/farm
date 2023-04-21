import React, { useCallback } from "react";
import { InternalLink } from "../links/links";
import EonianLogo from "./logo";
import styles from "./logo-with-text.module.scss";


const LogoWithText = () => {
  const { isHovered, onMouseOver, onMouseOut } = useHover();

  return (
    <InternalLink
      href="/"
      className={styles.logo}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      iconClassName={styles.logoIcon}
      icon={
        <EonianLogo
          color={isHovered ? "var(--color-text-100)" : "var(--color-text-300)"}
        />
      }
    >
      <span className={styles.name}>Eonian</span>
    </InternalLink>
  );
};

export default LogoWithText;

export const useHover = () => {
  const [isHovered, setValue] = React.useState(false);

  const onMouseOver = useCallback(() => setValue(true), [setValue]);
  const onMouseOut = useCallback(() => setValue(false), [setValue]);

  return {
    isHovered,
    onMouseOver,
    onMouseOut
  };
}
