import React from 'react';
import styles from './secops.module.scss';
import Image from 'next/image';
import MashBackgroundImage from './assets/mash-background.png';

export interface SecOpsProps {
  children: React.ReactNode;
}

export default function SecOps({ children }: SecOpsProps) {
  return (
    <div className={styles.secOps}>
      {children}
      <div className={styles.imageContainer}>
        <Image src={MashBackgroundImage} alt={'Mash Background Image'} />
      </div>
    </div>
  );
}
