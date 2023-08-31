import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import type { ImageProps } from '../features/features'
import Features from '../features/features'
import styles from './safe-investments.module.scss'
import citySrc from './assets/sci-fi-city-near-to-sea.png'

const SafeInvestments: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Features image={CityPic} right className={styles.safeInvestments}>
    {children}
  </Features>
)

function CityPic({ className }: ImageProps) {
  return <div className={clsx(className, styles.image)}>
    <Image src={citySrc} alt="sci-fy cityscape from sea" placeholder="blur" />
  </div>
}

export default SafeInvestments
