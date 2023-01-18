import React from "react";
import styles from "./founders-list.module.scss";

interface Props {
    children: React.ReactNode;
}

const FoundersList: React.FC<Props> = ({ children  }) => {
  return <ul className={styles.container}>{children}</ul>;
};

export default FoundersList;
