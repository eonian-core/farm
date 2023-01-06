import { MutableRefObject, useEffect, useRef } from "react";

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
export const useDimensions = (ref: MutableRefObject<any>) => {



  const {x, y} = ref.current?.getBoundingClientRect() || {};

  return {
    width: ref.current?.offsetWidth || 0,
    height: ref.current?.offsetHeight || 0,
    x: x || 0,
    y: y || 0,
  };
};
