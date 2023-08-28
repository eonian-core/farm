// important to react on ref.current changes
import type { MutableRefObject } from 'react'
import { useState } from 'react'
import { useOnResizeEffect } from '../resize-hooks/useOnResizeEffect'

export interface DimensionalState {
  width: number
  height: number
  x: number
  y: number
}

// Naive implementation - better will be to use layoutEffect
// to make calculations before DOM renders, but can breake SSR
export function useDimensions(ref: MutableRefObject<HTMLElement>): DimensionalState | null {
  const [dimensionsRef, setDimensions] = useState(() => ({ current: calculateDimensions(ref.current) }))

  useOnResizeEffect(() => {
    const current = calculateDimensions(ref.current)

    setDimensions({ current })
  }, [ref, ref.current])

  return dimensionsRef.current
}

export function calculateDimensions(el?: HTMLElement): DimensionalState | null {
  if (!el || !el.getBoundingClientRect()) {
    return null
  }

  const { x, y } = el.getBoundingClientRect()

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
    x,
    y,
  }
}
