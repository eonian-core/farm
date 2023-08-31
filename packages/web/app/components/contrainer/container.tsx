import clsx from 'clsx'
import React from 'react'
import styles from './container.module.scss'

// props for Container component
export interface ContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  children: React.ReactNode
  className?: string
}

/** Page view container, allow to separate rest page contant from container children on one screen */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, ...props }: ContainerProps, ref) => (
    <section {...props} className={clsx(styles.container, className)} ref={ref} />
  ),
)

Container.displayName = 'Container'

export default Container
