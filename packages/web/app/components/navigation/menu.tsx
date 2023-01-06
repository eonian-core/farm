import { useState, useEffect, useRef, MutableRefObject } from "react";
import { motion, useCycle } from "framer-motion";

import { HamburgerMenu } from "../hamburger-menu/hamburger-menu";
import { useDimensions } from "./use-dimensions";
import styles from "./navigation.module.scss";

export interface MenuProps {
    children: React.ReactNode;
    onStateChange?: (isOpen: boolean) => void;
}

export const Menu = ({children, onStateChange}: MenuProps) => {
    const [isOpen, toggleMenu] = useCycle(false, true);
    const containerRef = useRef(null);
    const [hamburgerRef, setHamburgerRef] = useState<MutableRefObject<HTMLDivElement | null>>({current: null}); // Need rerender to calculate dimensions
    const { height } = useDimensions(containerRef);
    const { x, y } = useDimensions(hamburgerRef);

    useEffect(() => {
        onStateChange && onStateChange(isOpen);
    }, [isOpen, onStateChange]);

    return (
        <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            ref={containerRef}
            className={styles.menuWrapper}
        >
            {hamburgerRef.current && (
                <motion.div className={styles.menuBackground} variants={sidebar(x, y)} >
                    {children}
                </motion.div>)
            }

            <div className={styles.hamburger}>
                <HamburgerMenu active={isOpen} onClick={toggleMenu} ref={
                    ref => {
                        if(!hamburgerRef.current && ref) setHamburgerRef({current: ref})}
                } />
            </div>
        </motion.div>
    );

}


export const MenuContent = () => {
    return <div></div>
}

const sidebar = (x: number, y: number) => ({
    open: (height = 100) => ({
      clipPath: `circle(${height * 2}vh at ${x + 15}px ${y + 15}px)`,
      transition: {
        type: "spring",
        stiffness: 50,
      }
    }),

    closed: {
      clipPath: `circle(0vh at ${x + 15}px ${y + 15}px)`,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 40
      }
    }
  });