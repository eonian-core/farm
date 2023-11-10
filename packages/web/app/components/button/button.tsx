import React from 'react'

import clsx from 'clsx'
import styles from './button.module.scss'

export interface Props extends Omit<React.HTMLProps<HTMLButtonElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg'
  bordered?: boolean
  gradient?: boolean
  dark?: boolean
  wide?: boolean
  round?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  /** Display icon position, default right */
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<Props> = ({
  size = 'md',
  bordered = false,
  gradient = false,
  dark = false,
  wide = false,
  round = false,
  disabled = false,
  icon,
  iconPosition = 'right',
  children,
  className,
  ...restProps
}) => {
  const classes = clsx(styles.button, styles[size], className, {
    [styles.bordered]: bordered,
    [styles.gradient]: gradient,
    [styles.dark]: dark,
    [styles.icon]: !!icon,
    [styles.wide]: wide,
    [styles.round]: round,
    [styles.disabled]: disabled,
  })
  return (
    <button className={classes} {...restProps}>
      {iconPosition === 'left' && icon}
      {children}
      {iconPosition === 'right' && icon}
    </button>
  )
}

export default Button
