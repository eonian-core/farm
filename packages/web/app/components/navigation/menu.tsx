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

const menuVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};

export const Menu = ({ children, isOpen, toggleMenu }: MenuProps) => {
    const containerRef = useRef(null);
    const [hamburgerRef, setHamburgerRef] = useState<MutableRefObject<HTMLDivElement | null>>({ current: null }); // Need rerender to calculate dimensions
    const { height = 0 } = useDimensions(containerRef) || {};
    const dimensions = useDimensions(hamburgerRef);
    const animation = useMenuAnimation(dimensions);

    return (
        <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            ref={containerRef}
            className={styles.menuWrapper}
        >
            {animation && (
                <motion.div className={styles.menuBackground} variants={animation} >
                    <motion.ul variants={menuVariants} className={clsx(inter.className, styles.menuList)}>
                        {children}
                    </motion.ul>
                </motion.div>)
            }

            <div className={styles.hamburger}>
                <HamburgerMenu active={isOpen} onClick={toggleMenu} ref={
                    ref => {
                        if (!hamburgerRef.current && ref) {
                            setHamburgerRef({ current: ref })
                        }
                    }
                } />
            </div>
        </motion.div>
    );
}

export default Menu;

const useMenuAnimation = (dimensions: DimensionalState | null) => useMemo(
    () => calculateMenuAnimation(dimensions),
    [dimensions, dimensions?.x, dimensions?.y, dimensions?.width, dimensions?.height]
);


function calculateMenuAnimation(dimensions: DimensionalState | null) {
    if (!dimensions) {
        return null;
    }

    const { x, y } = adjustCoordinates(dimensions);
    return animation(x, y);
}

// Need point to center of hamburger menu
function adjustCoordinates({ x, y, width, height }: DimensionalState) {
    // On touch devises we not have scroll bar
    const adjustX = isTouchDevice() ? 0 : 15;
    const adjustY = isTouchDevice() ? 7 : 5;

    return {
        x: x + width / 2 + adjustX,
        y: y + height / 2 + adjustY
    }
}

const animation = (x: number, y: number) => ({
    open: (height = 100) => ({
        clipPath: `circle(${height * 2}vh at ${x}px ${y}px)`,
        transition: {
            type: "spring",
            stiffness: 50,
        }
    }),

    closed: {
        clipPath: `circle(0vh at ${x}px ${y}px)`,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 40
        }
    }
});

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        // fallback for old browsers
        // @ts-ignore
        (navigator.msMaxTouchPoints > 0));
}