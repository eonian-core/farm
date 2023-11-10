'use client'

import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { MOBILE_SCREEN } from '../resize-hooks/screens'
import { useWindowSize } from '../resize-hooks/useWindowSize'

import './toast-container-wrapper.scss'

function ToastContainerWrapper() {
  const [navHeight, setNavHeight] = React.useState(0)
  const { width = 0, height = 0 } = useWindowSize()

  React.useEffect(() => {
    const navElement = window.document.getElementById('navigation')
    if (!navElement) {
      return
    }

    const { height } = navElement.getBoundingClientRect()
    setNavHeight(height)
  }, [height])

  const toastTopOffset = React.useMemo(() => {
    if (width < MOBILE_SCREEN) {
      return 0
    }

    return navHeight
  }, [width, navHeight])

  return <ToastContainer position={toast.POSITION.TOP_LEFT} theme="dark" style={{ top: `${toastTopOffset}px` }} />
}

export default ToastContainerWrapper
