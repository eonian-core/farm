import clsx from 'clsx'
import { ContainerProps } from 'postcss'
import React from 'react'
import { FadeInWrapper, FadeInWrapperProps } from '../fade-in/fade-in-list'
import styles from './container.module.scss'

export interface FadeInContainerPros extends ContainerProps, FadeInWrapperProps {
}

/** 
 * Page view container, allow to separate rest page content 
 * from container children on one screen.
 * And pass isInView context for children
 * */
export const FadeInContainer = ({ className, ...props }: FadeInContainerPros) => (
    <FadeInWrapper
        {...props}
        className={clsx(styles.container, className)}
        isSection
    />
)

export default FadeInContainer