import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import vaultPic from './assets/vault2.png'
import styles from "./vault-painting.module.scss"


export const VaultPainting = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <div className={styles.wrapper}>
            <motion.div
                ref={ref}
                className={styles.painting}
                initial={{ opacity: 0, x: -100, rotate: 340 }}
                animate={isInView && { opacity: 1, x: 0, rotate: 357 }}
                transition={{
                    duration: 1,
                    delay: 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                }}
            >
                <Image src={vaultPic} alt="Futuristic bank vault" placeholder="blur" />
            </motion.div>
        </div>
    )
}

export default VaultPainting