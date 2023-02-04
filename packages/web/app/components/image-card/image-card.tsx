import React from 'react'
import { H3Context } from '../heading/heading'
import IconExternal from '../icons/icon-external'

import styles from './image-card.module.scss'
import Image from "next/image";
import {StaticImageData} from "next/dist/client/image";

/** Props for Card component */
export interface ImageCardProps {
  /** Link to external page */
  href: string
  /** Path to image */
  image: StaticImageData
  /**
   * Children of card 
   * expect one h3 header and one p element and Target component
   * */
  children: React.ReactNode
}

/** Card component which primarly wraps block with header and text as card  */
export const ImageCard = ({href, image, children}: ImageCardProps) => (<a
    href={href}
    className={styles.imageCard}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image src={image} alt="magnifier image"/>
    <div className={styles.content}>
      <H3Context.Provider value={{ isExternalLink: false }}>
        {children}
      </H3Context.Provider>
    </div>
  </a>
)

export default ImageCard

export interface TargetProps {
  children: React.ReactNode
}


/** Used to highlight to user where or for what purpose he can use page, to which Card component leads to */
export const Target = ({children}: TargetProps) => (
  <span className={styles.target}>{children} <IconExternal size={12} className="ml-1 inline" /></span>
)
