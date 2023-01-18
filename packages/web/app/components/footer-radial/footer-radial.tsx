import React from "react";
import { useOnResizeEffect } from "../resize-hooks/useOnResizeEffect";
import styles from "./footer-radial.module.scss";
import RadialEffectPainter from "./radial-effect-painter";

interface Props {
  radius?: number
}

const FooterRadial: React.FC<Props> = ({ radius = 60 }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  useOnResizeEffect(() => {
    const { current: container } = ref;
    setWidth(container?.offsetWidth ?? 0);
    setHeight(container?.offsetHeight ?? 0);
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <RadialEffectPainter width={width} height={height} radius={radius} />
    </div>
  );
};

export default FooterRadial;
