import * as React from "react";
import { motion } from "framer-motion";

const variants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};

export interface MenuItemProps {
    children: React.ReactNode;
}

export const MenuItem = ({ children }: MenuItemProps) => {
    return (
        <motion.li
            variants={variants}
        >
            {children}
        </motion.li>
    );
};
