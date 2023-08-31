// based on https://codepen.io/2xsamurai/pen/WwmjKQ

import * as React from 'react'
import clsx from 'clsx'
import styles from './icon-scroll.module.scss'

export interface IconScrollProps {
  className?: string
}

const IconScroll: React.FC<IconScrollProps> = ({ className }) => (
  <div className={clsx(styles.scrollDowns, className)}>
    <div className={styles.mousey}>
      <div className={styles.scroller}></div>
    </div>
  </div>
)
export default IconScroll
