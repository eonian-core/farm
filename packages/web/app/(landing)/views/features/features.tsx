import React from 'react'

import clsx from 'clsx'
import Container from '../../../components/contrainer/container'
import FadeInList from '../../../components/fade-in/fade-in-list'
import { useIsMobileOrSmaller } from '../../../components/resize-hooks/screens'
import styles from './features.module.scss'

export interface ImageProps {
  className: string
}

interface StableProfitProps extends React.PropsWithChildren {
  /** Image which will be rendered */
  image: (props: ImageProps) => React.ReactNode
  /** Show image on right side */
  right?: boolean
  className?: string
}

const Features: React.FC<StableProfitProps> = ({ children, image, right, className }) => {
  const isMobileOrSmaller = useIsMobileOrSmaller()

  const Image = image({
    className: clsx(styles.image, { [styles.right]: right }),
  })

  return (
    <Container>
      <FadeInList
        className={clsx(className, styles.wrapper, { [styles.right]: right })}
        amount={!isMobileOrSmaller ? 0.3 : 0.1}
        initialDelay={0}
      >
        {!right && Image}

        <div className={clsx(styles.features, { [styles.right]: right })}>{children}</div>

        {right && Image}
      </FadeInList>
    </Container>
  )
}

export default Features
