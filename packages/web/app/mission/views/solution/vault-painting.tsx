import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRef } from 'react'

import { useInView } from '../../../components/use-in-view/use-in-view'
import vaultPic from './assets/vault2.png'
import styles from './vault-painting.module.scss'

export function VaultPainting() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div className={styles.wrapper}>
      <motion.div
        ref={ref}
        className={styles.painting}
        initial={{ opacity: 0, x: -100, rotate: 340 }}
        animate={isInView && { opacity: 1, x: 0, rotate: 357 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Image src={vaultPic} alt="Futuristic bank vault" placeholder="blur" />
      </motion.div>
    </div>
  )
}

export default VaultPainting
