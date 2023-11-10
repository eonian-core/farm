import Image from 'next/image'

import clsx from 'clsx'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import type { FadeInProps } from '../fade-in/fade-in'
import FadeIn from '../fade-in/fade-in'
import styles from './fade-in-image.module.scss'

export interface FadeInImageProps extends Omit<FadeInProps, 'children'> {
  src: string | StaticImport
  alt: string
}

/** Image with Fade In animation and base background gradient template */
export function FadeInImage({ className, src, alt, ...props }: FadeInImageProps) {
  return <FadeIn
        className={clsx(styles.container, className)}
        {...props}
        >
        <Image src={src} alt={alt} placeholder="blur" />
    </FadeIn>
}
