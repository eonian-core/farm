import React from 'react'
import { Inter } from "@next/font/google";
import styles from './heading.module.scss'

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: 'block' // force to show font anyway
  });

export const H2 = ({ children }: { children?: React.ReactNode }) => (
    <h2 className={`${styles.header2} ${inter.className}`}>{children}</h2>
)

export const H1SubPage = ({ children }: { children?: React.ReactNode }) => (
    <h1 className={`${styles.header1SubPage} ${inter.className}`}>{children}</h1>
)

const heading = {
  H2,
  H1SubPage,
};

export default heading
