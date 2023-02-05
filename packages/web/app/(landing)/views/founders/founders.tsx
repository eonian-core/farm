import dynamic from "next/dynamic";
import React from "react";
import { useIsMobileOrSmaller } from "../../../components/resize-hooks/screens";
import styles from "./founders.module.scss";

interface Props {
  children: React.ReactNode;
}

const Founders: React.FC<Props> = ({ children }) => {
  const FadeInChildren = dynamic(() => import('../../../components/fade-in/fade-in-children'));

  const isMobileOrSmaller = useIsMobileOrSmaller()

  return (
    <FadeInChildren className={styles.container} amount={!isMobileOrSmaller ? 0.3 : 0.2} initialDelay={0} delay={0.3}>{children}</FadeInChildren>
  );
};

export default Founders;
