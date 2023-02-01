import React from "react";
import Container from "../../../components/contrainer/container";
import FlowDiagram from "./flow-diagram";
import FlowSliderItem, { FlowSliderItemProps } from "./flow-slider-item";
import styles from "./how-it-works.module.scss";

interface Props {
  children: React.ReactNode;
}

interface HIWContextState {
  itemWidth: number;
  activeStep: string | null;
  setActiveStep: (label: string) => void;
}

export const HIWContext = React.createContext<HIWContextState>({
  itemWidth: 0,
  activeStep: null,
  setActiveStep: () => {},
});

const HowItWorks: React.FC<Props> = ({ children }) => {
  const diagramRef = React.useRef<FlowDiagram>(null);
  const stepLabels = useStepLabels(children);

  const [activeStep, setActiveStep] = React.useState(stepLabels[0]);
  const contextValue = { itemWidth: 350, activeStep, setActiveStep };

  React.useEffect(() => {
    diagramRef.current?.selectPoint(activeStep);
  }, [activeStep]);

  return (
    <Container>
      <div className={styles.container}>
        <HIWContext.Provider value={contextValue}>
          {children}
        </HIWContext.Provider>
        <FlowDiagram
          ref={diagramRef}
          onActiveStepChanged={setActiveStep}
          stepLabels={stepLabels}
        />
      </div>
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
  for (const { type, props } of elements) {
    if (type === FlowSliderItem) {
      const itemProps = props as FlowSliderItemProps;
      result.push(itemProps.stepLabel);
      continue;
    }

    if ("children" in props) {
      const next = extractStepLabels(props.children);
      result.push(...next);
    }
  }
  return result;
}

export default HowItWorks;
