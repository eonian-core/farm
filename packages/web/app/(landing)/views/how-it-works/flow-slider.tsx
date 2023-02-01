import React from "react";
import styles from "./flow-slider.module.scss";
import { HIWContext } from "./how-it-works";

interface Props {
  children: React.ReactNode;
}

const FlowSlider: React.FC<Props> = ({ children }) => {
  const { activeStep, setActiveStep } = React.useContext(HIWContext);
  return <div className={styles.container}>{children}</div>;
};

export default FlowSlider;
