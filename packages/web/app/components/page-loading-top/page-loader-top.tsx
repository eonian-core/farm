'use client'

import React from 'react'
import { useParams, usePathname } from 'next/navigation'
import { useAppSelector } from '../../store/hooks'
import styles from './page-loader-top.module.scss'

function PageLoaderTop() {
  const ref = React.useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const param = useParamValue()
  const pageLoading = useAppSelector(state => state.navigation.pageLoading)

  const [animation, setAnimation] = React.useState<Animation | null>(null)

  React.useEffect(() => {
    const { current: loader } = ref
    if (!loader) {
      return
    }

    const loaderProgress = [
      { width: '0', opacity: 0.5 },
      { width: '20vw', opacity: 0.9, offset: 0.1 },
      { width: '40vw', opacity: 1, offset: 0.3 },
      { width: '60vw', opacity: 0.9, offset: 0.5 },
      { width: '100vw', opacity: 0.75 },
    ]
    const newAnimation = loader.animate(loaderProgress, {
      duration: 5000,
      fill: 'forwards',
    })
    newAnimation.cancel()
    return setAnimation(newAnimation)
  }, [])

  React.useEffect(() => {
    if (!pageLoading || !animation) {
      return
    }

    const isLoadingInitiated = pageLoading !== pathname
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const wasRedirected = pathname === `${pageLoading}/${param}`
    if (isLoadingInitiated && !wasRedirected) {
      animation.play()
      return
    }

    animation.finish()
    const timeout = setTimeout(() => animation.cancel(), 100)
    return () => clearTimeout(timeout)
  }, [pathname, param, pageLoading, animation])

  // Handle "back" navigation", previous page is loaded, we don't need to show loading animation.
  React.useEffect(() => {
    const handler = () => setTimeout(() => animation?.cancel(), 100)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [animation])

  return <div ref={ref} className={styles.loader} />
}

function useParamValue() {
  const params = useParams()
  const [value] = Object.values(params)
  return value
}

export default PageLoaderTop
