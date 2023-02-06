import React from "react";
import FadeInChildList from "../../../components/fade-in/fade-in-child-list";
import FadeInList from "../../../components/fade-in/fade-in-list";
import { useIsTabletOrSmaller } from "../../../components/resize-hooks/screens";
import styles from "./founders-list.module.scss";

interface Props {
  children: React.ReactNode;
}

const FoundersList: React.FC<Props> = ({ children }) => {

  const isTabletOrSmaller = useIsTabletOrSmaller()

  return (
    <FadeInChildList 
      className={styles.container} 
      isUl
      amount={!isTabletOrSmaller ? 0.9 : 0.1}
      initialDelay={0.3}
      delay={0.2}
      >{children}
      </FadeInChildList>
  );
};

export default FoundersList;
