import { useState, useRef, MutableRefObject, useMemo } from "react";
import { motion } from "framer-motion";

import { HamburgerMenu } from "../hamburger-menu/hamburger-menu";
import { DimensionalState, useDimensions } from "./use-dimensions";
import styles from "./navigation.module.scss";
import { Inter } from "@next/font/google";
import clsx from "clsx";



export interface MenuProps {
    children: React.ReactNode;
    isOpen?: boolean;
    toggleMenu?: () => void;
}

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: 'block' // force to show font anyway
});


export const Menu = ({ children, isOpen, toggleMenu }: MenuProps) => {

    return (
        <div
            className={clsx(styles.menuWrapper, {[styles.menuOpen]: isOpen})}
        >
            <div className={styles.menuBackground} >
                <ul className={clsx(inter.className, styles.menuList)}>
                    {children}
                </ul>
            </div>

            <div className={styles.hamburger}>
                <HamburgerMenu active={isOpen} onClick={toggleMenu} />
            </div>
        </div>
    );
}

export default Menu;
