import clsx from 'clsx'
import React from 'react'
import styles from './container.module.scss'

// props for Container component
export interface ContainerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
    children: React.ReactNode
    mobileFullWidth?: boolean
    className?: string
}

export const Container = React.forwardRef<HTMLElement, ContainerProps>(({ mobileFullWidth, className, ...props }: ContainerProps, ref) => (
    <section 
        {...props}
        className={clsx(styles.container, { [styles.mobileFullWidth]: mobileFullWidth }, className)} 
        ref={ref}
        />
))

Container.displayName = 'Container'

export default Container