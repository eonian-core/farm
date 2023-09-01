import Image from 'next/image'

import clsx from "clsx";
import FadeIn, { FadeInProps } from "../fade-in/fade-in";
import styles from './fade-in-image.module.scss'
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export interface FadeInImageProps extends Omit<FadeInProps, 'children'> {
    src: string | StaticImport;
    alt: string;
}

/** Image with Fade In animation and base background gradient template */
export const FadeInImage = ({className, src, alt, ...props}: FadeInImageProps) => (
    <FadeIn 
        className={clsx(styles.container, className)}
        {...props}
        >
        <Image src={src} alt={alt} placeholder="blur" />
    </FadeIn>
)