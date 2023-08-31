// Based on https://github.com/framer/motion/blob/bafa7a925d23b79141ad90a03bd0a544d4deba59/packages/framer-motion/src/utils/use-in-view.ts
// Implementation with fix for https://github.com/framer/motion/issues/1940
// Bug prevent using `useInView` for mobile devices
// TODO: remove when fix will be implemented
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
import type { InViewOptions } from '@motionone/dom'
import { inView } from '@motionone/dom'

interface Options extends Omit<InViewOptions, 'root' | 'amount'> {
  root?: RefObject<Element>
  once?: boolean
  amount?: 'some' | 'all' | number
}

export function useInView(ref: RefObject<Element>, { root, margin, amount, once = false }: Options = {}) {
  const [isInView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current || (once && isInView)) {
      return
    }

    const onEnter = () => {
      setInView(true)

      return once ? undefined : () => setInView(false)
    }

    const options: InViewOptions = {
      root: root?.current ?? undefined,
      margin,
      amount: amount === 'some' ? 'any' : amount,
    }

    return inView(ref.current, onEnter, options)
  }, [root, ref, margin, once, amount, isInView])

  return isInView
}
