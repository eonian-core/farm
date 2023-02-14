import React from "react";
import { H3 } from "../heading/heading";

import styles from './column-item.module.scss';

export interface ColumnItemProps {
  title: string;
  children: React.ReactNode;
}

const ColumnItem: React.FC<ColumnItemProps> = ({ title, children }) => {
  return (
    <div className={styles.container}>
      <H3>{title}</H3>
      {children}
    </div>
  );
};

export default ColumnItem;
