import clsx from "clsx";
import Link from "next/link";
import React, { useCallback } from "react";
import EonianLogo from "./logo";
import styles from "./logo-with-text.module.scss";


const LogoWithText = () => {
  const { isHovered, onMouseOver, onMouseOut } = useHover();

  return (
    <Link href="/" className={styles.logo} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <div className={styles.logoIcon}>
        <EonianLogo color={isHovered ? 'var(--color-text-100)': 'var(--color-text-300)'} />
      </div>
      <span>Eonian</span>
    </Link>
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
