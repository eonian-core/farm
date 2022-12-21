import { Roboto } from '@next/font/google'
import Container from '../contrainer/container'
import styles from './hero.module.scss'

const roboto = Roboto({ subsets: ['latin'] , weight: ['300', '500', '700', '900']})

export default function Hero() {
  return (
    <Container>
      <div className={styles.hero}>
        <h1 className={roboto.className}>
          Make Crypto <br /> Work for You.
        </h1>
        <p className={roboto.className}>
          We build passive crypto-investment strategies that cares about your money.
        </p>
      </div>
    </Container>
  )
}