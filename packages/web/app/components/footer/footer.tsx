import React from 'react'
import LogoWithText from '../logo/logo-with-text'
import { useLocalSocials } from '../../socials'
import styles from './footer.module.scss'
import { Resources } from './resources'
import { Socials } from './socials'

function Footer() {
  const socials = useLocalSocials()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <LogoWithText />
          <div className={styles.sign}>
            Hand-crafted with <span className={styles.heart}>❤️</span> by our team
          </div>
        </div>

        <Resources />

        <Socials {...{ socials }} />
      </div>

      <div className={styles.copyright}>
        Copyright &copy; {new Date().getFullYear()} <span>Eonian Finance</span>
      </div>
    </footer>
  )
}

export default Footer
