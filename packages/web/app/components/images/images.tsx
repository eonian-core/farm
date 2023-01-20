import React from "react";
import Image from "next/image"

export type ImageProps = {
    src: string;
    alt: string;
    placeholder: 'blur' | 'empty' | undefined;
    height?: number | `${number}` | undefined;
    width?: number | `${number}` | undefined;
}

export const ImageWrapper = ({ src, alt, placeholder, height, width, ...props }: ImageProps) => (
  <Image src={src} alt={alt} placeholder={placeholder} height={height} width={width} {...props} />
);
