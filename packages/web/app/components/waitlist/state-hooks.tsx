import { useCallback, useState } from 'react'

export function useOnFocus() {
  const [isFocused, setFocused] = useState(false)

  const onFocus = useCallback(() => setFocused(true), [])
  const onBlur = useCallback(() => setFocused(false), [])

  return [isFocused, { onFocus, onBlur }] as const
}

/** Simple hook to setup and detect hover */
export function useOnHover() {
  const [hover, setHover] = useState(false)

  const onMouseEnter = useCallback(() => setHover(true), [])
  const onMouseLeave = useCallback(() => setHover(false), [])

  return [hover, { onMouseEnter, onMouseLeave }] as const
}
