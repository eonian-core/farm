import React, { useContext } from 'react'
import { Inter } from "@next/font/google";
import Balancer from 'react-wrap-balancer'; // very tiny, can be imported synchroniusly

import styles from './heading.module.scss'
import IconExternal from '../icons/icon-external';
import clsx from 'clsx';

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: 'block' // force to show font anyway
});

export const H1 = ({ children }: { children?: React.ReactNode }) => (
    <h1 className={clsx(styles.header1, inter.className)}>{children}</h1>
)

export const H2 = ({ children }: { children?: React.ReactNode }) => (
    <h2 className={clsx(styles.header2, inter.className)}><Balancer>{children}</Balancer></h2>
)

export interface H3ContextState {
    isExternalLink: boolean;
}

export const H3Context = React.createContext<H3ContextState>({ isExternalLink: false });

export const H3 = ({ children }: { children?: React.ReactNode }) => {
    const { isExternalLink } = useContext(H3Context);

    return (
        <h3 className={`${styles.header3} ${inter.className}`}>
            {children}
            {isExternalLink && <IconExternal size={12} className="ml-1 inline" />}
        </h3>
    )
}

const heading = {
    H1,
    H2,
    H3
}

export default heading
