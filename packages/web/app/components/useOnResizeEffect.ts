import { DependencyList, EffectCallback, useEffect } from "react";

/** Will trigger effect same way as useEffect and additionaly on window resize */
export function useOnResizeEffect(effect: EffectCallback, deps?: DependencyList) {
    useEffect(() => {
      // Initial calculation
      effect();
  
      window.addEventListener("resize", effect);
  
      return () => window.removeEventListener("resize", effect);
    }, deps);
  }