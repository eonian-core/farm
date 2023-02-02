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
  const contentRef = React.useRef<HTMLDivElement>(null);

  const { itemWidth, activeStep, setActiveStep } = React.useContext(HIWContext);

  const [activeRelativeOffsetY, setActiveRelativeOffsetY] = React.useState<number | null>(null);

  const handleClick = React.useCallback(() => {
    setActiveStep(stepLabel);
  }, [stepLabel, setActiveStep]);

  const isActive = stepLabel === activeStep;

  React.useEffect(() => {
    const { current: element } = contentRef;
    const parent = element?.parentElement;
    if (!element || !parent) {
      return;
    }
    const { height } = element.getBoundingClientRect();
    const { height: parentHeight } = parent.getBoundingClientRect();
    setActiveRelativeOffsetY(parentHeight - height - parentHeight / 2);
  }, [isActive]);

  const className = clsx(styles.container, {
    [styles["container--active"]]: isActive,
  });

  return (
    <div
      className={className}
      style={{ width: `${itemWidth}px` }}
      id={stepLabel}
    >
      <div
        ref={contentRef}
        onClick={handleClick}
        className={styles.content}
        style={
          isActive && activeRelativeOffsetY != null
            ? { transform: `translateY(${activeRelativeOffsetY}px)` }
            : undefined
        }
      >
        <h3>{stepLabel}</h3>
        {children}
      </div>
    </div>
  );
};

export default FlowSliderItem;
