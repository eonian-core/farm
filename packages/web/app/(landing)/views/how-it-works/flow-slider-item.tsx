import clsx from "clsx";
import React from "react";
import styles from "./flow-slider-item.module.scss";
import { HIWContext } from "./how-it-works";

export interface FlowSliderItemProps {
  stepLabel: string;
  children: React.ReactNode;
}

const FlowSliderItem: React.FC<FlowSliderItemProps> = ({
  stepLabel,
  children,
}) => {
  const { itemWidth, activeStep, setActiveStep } = React.useContext(HIWContext);

  const handleClick = React.useCallback(() => {
    setActiveStep(stepLabel);
  }, [stepLabel, setActiveStep]);

  const className = clsx(styles.container, {
    [styles['container--active']]: stepLabel === activeStep,
  });
  return (
    <div
      className={className}
      style={{ width: `${itemWidth}px` }}
      id={stepLabel}
    >
      <div onClick={handleClick} className={styles.content}>
        <h3>{stepLabel}</h3>
        {children}
      </div>
    </div>
  );
};

export default FlowSliderItem;
