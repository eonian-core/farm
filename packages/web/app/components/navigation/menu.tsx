import { useState, useEffect, useRef, MutableRefObject, useMemo } from "react";
import { motion, useCycle } from "framer-motion";

import { HamburgerMenu } from "../hamburger-menu/hamburger-menu";
import { DimensionalState, useDimensions } from "./use-dimensions";
import styles from "./navigation.module.scss";

export interface MenuProps {
    children: React.ReactNode;
    isOpen?: boolean;
    toggleMenu?: () => void;
}

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
                    {children}
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

const useMenuAnimation = (dimensions: DimensionalState | null) => useMemo(
    () => calculateMenuAnimation(dimensions), 
    [dimensions, dimensions?.x, dimensions?.y, dimensions?.width, dimensions?.height]
);


function calculateMenuAnimation(dimensions: DimensionalState | null){
    if(!dimensions) {
        return null;
    }

    const { x, y } = adjustCoordinates(dimensions);
    return animation(x, y);
}

// Need point to center of hamburger menu
function adjustCoordinates({x, y, width, height}: DimensionalState) {
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