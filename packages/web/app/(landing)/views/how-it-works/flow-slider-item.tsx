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

  const handleClick = React.useCallback(() => {
    setActiveStep(stepLabel);
  }, [stepLabel, setActiveStep]);

  const isActive = stepLabel === activeStep;
  const activeRelativeOffsetY = useRelativeOffsetY(contentRef, [isActive]);
  const numberColor = usePointColor(stepLabel);

  const contentStyles = React.useMemo(() => {
    const styles = {} as any;
    const hasOffset = isActive && activeRelativeOffsetY != null;
    if (hasOffset) {
      styles["transform"] = `translateY(${activeRelativeOffsetY}px)`;
    }
    if (numberColor) {
      styles["--card-number-color"] = numberColor;
    }
    return styles;
  }, [isActive, activeRelativeOffsetY, numberColor]);

  const className = clsx(styles.container, { [styles.containerActive]: isActive });
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
        style={contentStyles}
      >
        <h3>{stepLabel}</h3>
        {children}
      </div>
    </div>
  );
};

function usePointColor(key: string) {
  const [color, setColor] = React.useState<string | null>(null);
  React.useEffect(() => {
    const point = document.getElementById(`point-${key}`);
    const color = point?.getAttribute("data-color");
    color && setColor(color);
  }, [key]);
  return color;
}

function useRelativeOffsetY<T extends HTMLElement>(
  ref: React.RefObject<T>,
  deps: any[]
) {
  const [offsetY, setOffsetY] = React.useState<number | null>(null);
  React.useEffect(() => {
    const { current: element } = ref;
    const parent = element?.parentElement;
    if (!element || !parent) {
      return;
    }
    const { height } = element.getBoundingClientRect();
    const { height: parentHeight } = parent.getBoundingClientRect();
    setOffsetY(parentHeight - height - parentHeight / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return offsetY;
}

export default FlowSliderItem;
