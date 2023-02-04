"use client";
import { useInView } from "framer-motion";
import React from "react";
import Container from "../../../components/contrainer/container";
import { useOnResizeEffect } from "../../../components/resize-hooks/useOnResizeEffect";
import { HIW_AUTOSCROLL_DURATION } from "./constants";
import { HIWContextState, defaultHIWContextState, HIWContext } from "./context";
import FlowDiagram from "./flow-diagram";
import { FlowSliderItemProps } from "./flow-slider-item";
import styles from "./how-it-works.module.scss";

interface Props {
  children: React.ReactNode;
}

const HowItWorks: React.FC<Props> = ({ children }) => {
  const containerRef = React.useRef<HTMLElement>(null);
  // const diagramRef = React.useRef<FlowDiagram>(null);
  const stepLabels = useStepLabels(children);

  const isInView = useInView(containerRef);

  const [activeStep, setActiveStep] = React.useState(stepLabels[0]);

  useOnResizeEffect(() => {
    setActiveStep(stepLabels[0]);
  }, []);

  const contextValue: HIWContextState = React.useMemo(
    () => ({
      ...defaultHIWContextState,
      steps: stepLabels,
      activeStep,
      setActiveStep,
    }),
    [stepLabels, activeStep]
  );

  React.useEffect(() => {
    if (!isInView) {
      return;
    }
    const interval = window.setInterval(() => {
      const index = stepLabels.indexOf(activeStep) + 1;
      const nextStep = stepLabels[index >= stepLabels.length ? 0 : index];
      setActiveStep(nextStep);
    }, HIW_AUTOSCROLL_DURATION);
    return () => window.clearInterval(interval);
  }, [isInView, activeStep, stepLabels]);

  return (
    <Container ref={containerRef} className={styles.container}>
      <HIWContext.Provider value={contextValue}>
        {children}
      </HIWContext.Provider>
    </Container>
  );
};

function useStepLabels(children: React.ReactNode): string[] {
  return React.useMemo(() => extractStepLabels(children), [children]);
}

function extractStepLabels(children: React.ReactNode): string[] {
  const elements = React.Children.toArray(children) as React.ReactElement[];
  if (!Array.isArray(elements) || !elements.length) {
    return [];
  }

  const result = [];
  for (const { props } of elements) {
    if (props && "stepLabel" in props) {
      const itemProps = props as FlowSliderItemProps;
      result.push(itemProps.stepLabel);
      continue;
    }

    if (props && "children" in props) {
      const next = extractStepLabels(props.children);
      result.push(...next);
    }
  }
  return result;
}

export default HowItWorks;
