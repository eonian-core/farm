import clsx from "clsx";
import React from "react";
import FadeInList from "../fade-in/fade-in-list";

import styles from "./content-with-columns.module.scss";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ContentWithColumns: React.FC<Props> = ({ children, className }) => {
  return (
    <FadeInList
      amount="some"
      initialDelay={0.1}
      className={clsx(styles.container, className)}
    >
      {children}
    </FadeInList>
  );
};

export default ContentWithColumns;
