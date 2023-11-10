import React from 'react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import styles from './founder.module.scss'

import AvatarYuriy from './assets/yuriy.png'
import AvatarVladislav from './assets/vladislav.png'
import AvatarArtem from './assets/artem.png'
import AvatarSergey from './assets/sergey.png'

interface Props {
  name: string
  children: React.ReactNode
}

const avatars: Record<string, StaticImageData> = {
  yuriy: AvatarYuriy,
  vladislav: AvatarVladislav,
  sergey: AvatarSergey,
  artem: AvatarArtem,
}

const Founder: React.FC<Props> = ({ children, name }) => (
  <li className={styles.container}>
    <div className={styles.avatar}>
      <Image src={avatars[name]} alt="avatar" placeholder="blur" />
    </div>
    {children}
  </li>
)

export default Founder
