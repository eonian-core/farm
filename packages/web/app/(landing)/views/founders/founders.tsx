import React from "react";
import styles from "./founders.module.scss";

interface Props {
  children: React.ReactNode;
}

const Founders: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Founders;
