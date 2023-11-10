/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import clsx from 'clsx'
import { useRef } from 'react'
import type { FieldError } from 'react-hook-form'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './waitlist-form.module.scss'

export interface EmailLabelProps {
  focused?: boolean
  error?: FieldError
}

export function EmailLabel(props: EmailLabelProps) {
  const { error } = props
  const text = genLabel(props)

  return (<label className={clsx({ [styles.error]: error })} htmlFor="email"><span className={styles.parts}>Email</span>{!text ? '' : ' '}<EmailLabelText {...{ text }} /></label>)
}

export function EmailLabelText({ text }: { text: string }) {
  const nodeRef = useRef<HTMLElement | null>(null)

  return (
        <SwitchTransition>
            <CSSTransition
                key={text}
                nodeRef={nodeRef}
                addEndListener={(done: any) => {
                  nodeRef.current?.addEventListener?.('transitionend', done, false)
                }}
                classNames={{
                  enter: styles.partsEnter,
                  enterActive: styles.partsEnterActive,
                  enterDone: styles.partsEnterDone,
                  exit: styles.partsExit,
                  exitActive: styles.partsExitActive,
                  exitDone: styles.partsExitDone,
                }}
            ><span className={clsx(styles.parts, { [styles.partsFocused]: !text })} ref={nodeRef}>{text}</span></CSSTransition>
        </SwitchTransition>
  )
}
// must be function, not a companent to make animation work
export function genLabel({ focused, error }: EmailLabelProps) {
  if (error?.type === 'required') {
    return 'is need for submit'
  }

  if (error?.type === 'validate' || error?.type === 'pattern') {
    return 'must contain "@" and "." characters'
  }

  if (error) {
    return 'is incorrect'
  }

  if (focused) {
    return ''
  }

  return (
    'me when I can access app'
  )
}
