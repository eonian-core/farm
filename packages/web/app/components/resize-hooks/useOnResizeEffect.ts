import type { DependencyList, EffectCallback } from 'react'
import { useEffect } from 'react'

/** Will trigger effect same way as useEffect and additionaly on window resize */
export function useOnResizeEffect(effect: EffectCallback, deps?: DependencyList) {
  useEffect(() => {
    // Initial calculation
    effect()

    window.addEventListener('resize', effect)

    return () => window.removeEventListener('resize', effect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
