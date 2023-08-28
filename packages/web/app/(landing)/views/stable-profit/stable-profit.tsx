import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import type { ImageProps } from '../features/features'
import Features from '../features/features'
import styles from './stable-profit.module.scss'
import citySrc from './assets/sci-fi-city-with-rocket.png'

const StableProfit: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Features image={CityPic}>{children}</Features>
)

function CityPic({ className }: ImageProps) {
  return <div className={clsx(className, styles.image)}>
    <Image src={citySrc} alt="sci-fy cityscape with launching rocket" placeholder="blur" />
  </div>
}

export default StableProfit
