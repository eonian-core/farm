import React from 'react'
import clsx from 'clsx';
import Image from 'next/image';
import { StaticImageData } from 'next/dist/client/image';

import { H3Context } from '../heading/heading'
import styles from './image-card.module.scss'
import IconExternal from '../icons/icon-external'

/** Props for Card component */
export interface ImageCardProps {
  /** Link to external page */
  href: string
  /** Path to image */
  image: StaticImageData
  /** Alt image name */
  alt: string
  /** Vertical orientation */
  isVertical?: boolean
  /** Inactive behavior */
  disabled?: boolean,
  /** Alternative override className */
  className?: string,
  /**
   * Children of card 
   * expect one h3 header and one p element and Target component
   * */
  children: React.ReactNode
}

/** Card component which primarly wraps block with header and text as card  */
export const ImageCard = ({ href, image, alt = '', isVertical = false, disabled = false, className,  children }: ImageCardProps) => (
  <a
    href={href}
    className={clsx(styles.imageCard, className, {[styles.imageCardVertical]: isVertical, [styles.disabled]: disabled})}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Image src={image} alt={alt} placeholder="blur" />
    <div className={styles.content}>
      <H3Context.Provider value={{ isExternalLink: false }}>
        {children}
      </H3Context.Provider>
    </div>
  </a>
);

export default ImageCard

export interface TargetProps {
  children: React.ReactNode
  /** Inactive behavior */
  disabled?: boolean
}


/** Used to highlight to user where or for what purpose he can use page, to which Card component leads to */
export const Target = ({children, disabled = false}: TargetProps) => (
  <span className={styles.target}>
    {children}
    <IconExternal size={12} className={clsx("ml-1 inline", {[styles.disabledTarget]: disabled})}/>
  </span>
)
