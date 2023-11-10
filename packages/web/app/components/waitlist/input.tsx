import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import styles from './input.module.scss'

export interface EmailInputProps extends InputHTMLAttributes<HTMLInputElement> {

}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(({ className, ...props }, ref) => <input
    ref={ref}
    className={clsx(className, styles.input)}
    spellCheck="false"
    type="email"
    {...props}
/>)

EmailInput.displayName = 'EmailInput'
