import clsx from 'clsx'
import type { ContainerProps } from 'postcss'
import React from 'react'
import type { FadeInWrapperProps } from '../fade-in/fade-in-list'
import { FadeInWrapper } from '../fade-in/fade-in-list'
import styles from './container.module.scss'

export interface FadeInContainerPros extends ContainerProps, FadeInWrapperProps {}

/**
 * Page view container, allow to separate rest page content
 * from container children on one screen.
 * And pass isInView context for children
 * */
export function FadeInContainer({ className, ...props }: FadeInContainerPros) {
  return <FadeInWrapper {...props} className={clsx(styles.container, className)} isSection />
}

export default FadeInContainer
