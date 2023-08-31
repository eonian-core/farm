import dynamic from 'next/dynamic'

export const ToastContainerWrapperDynamic = dynamic(() => import('./toast-container-wrapper'), {
  ssr: false,
})
