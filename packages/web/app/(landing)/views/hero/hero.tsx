import { Inter } from '@next/font/google'
import Container from '../contrainer/container'
import styles from './hero.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Hero() {
  return (
    <Container>
      <h1 className={inter.className}>
        Making Crypto Work for You.
      </h1>
      <p className={inter.className}>
        We build passive crypto-investment strategies that cares about your money.
      </p>
    </Container>
  )
}