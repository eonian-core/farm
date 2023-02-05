import dynamic from "next/dynamic";
import React from "react";
import { useIsTabletOrSmaller } from "../../../components/resize-hooks/screens";
import styles from "./founders-list.module.scss";

interface Props {
  children: React.ReactNode;
}

const FoundersList: React.FC<Props> = ({ children }) => {
  const FadeInChildren = dynamic(() => import('../../../components/fade-in/fade-in-children'));

  const isTabletOrSmaller = useIsTabletOrSmaller()

  return (
    <FadeInChildren 
      className={styles.container} 
      isUl
      amount={!isTabletOrSmaller ? 'all' : 0.3}
      >{children}</FadeInChildren>
  );
};

export default FoundersList;
