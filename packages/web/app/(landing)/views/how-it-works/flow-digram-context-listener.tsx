'use client';
import React from "react";
import { HIWContext } from "./context";
import FlowDiagram from "./flow-diagram";

const FlowDiagramContextListener = () => {
  const { activeStep } = React.useContext(HIWContext);

  const diagramRef = React.useRef<FlowDiagram>(null);

  React.useEffect(() => {
    diagramRef.current?.selectPoint(activeStep);
  }, [activeStep]);

  return (
    <>
      <FlowDiagram ref={diagramRef} />
    </>
  );
};

export default FlowDiagramContextListener;
