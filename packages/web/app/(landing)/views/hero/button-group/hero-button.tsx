'use client'

import React from 'react'
import clsx from 'clsx'
import { useIsDesktopOrSmaller } from '../../../../components/resize-hooks/screens'
import { WrapperLink } from '../../../../components/links/wrapper-link'
import type { Props as ButtonProps } from '../../../../components/button/button'
import Button from '../../../../components/button/button'

import styles from './hero-button.module.scss'

interface Props extends ButtonProps {
  children: React.ReactNode
  href?: string
  icon?: React.ReactNode
  bold?: boolean
}

const HeroButton: React.FC<Props> = ({
  children,
  href = '#',
  icon,
  bold,
  bordered,
  ...restProps
}) => {
  const isDesktop = useIsDesktopOrSmaller()

  return (
    <WrapperLink className={clsx(styles.button, { [styles.bold]: bold }, { [styles.dark]: !bordered })} href={href}>
      <Button size={isDesktop ? 'md' : 'lg'} icon={icon} dark wide round bordered={bordered} {...restProps}>
        {children}
      </Button>
    </WrapperLink>
  )
}

export default HeroButton
