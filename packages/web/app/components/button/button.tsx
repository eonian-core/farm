import React from "react";

import styles from "./button.module.scss";
import clsx from "clsx";

export interface Props extends Omit<React.HTMLProps<HTMLButtonElement>, 'size' | 'type'> {
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
  gradient?: boolean;
  dark?: boolean;
  wide?: boolean;
  round?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<Props> = ({
  size = "md",
  bordered = false,
  gradient = false,
  dark = false,
  wide = false,
  round = false,
  icon,
  children,
  ...restProps
}) => {
  const classes = clsx(styles.button, styles[size], {
    [styles["bordered"]]: bordered,
    [styles["gradient"]]: gradient,
    [styles["dark"]]: dark,
    [styles["icon"]]: !!icon,
    [styles["wide"]]: wide,
    [styles["round"]]: round,
  });
  return (
    <button className={classes} {...restProps}>
      {children}
      {icon}
    </button>
  );
};

export default Button;
