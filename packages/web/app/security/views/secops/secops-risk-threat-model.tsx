import React from 'react';
import Image from 'next/image';
import ImageCard from '../../../components/image-card/image-card';
import umbrellaPic from './assets/umbrella.png';
import { useIsDesktopOrSmaller, useIsTabletOrSmaller } from '../../../components/resize-hooks/screens';
import styles from './secops.module.scss';

/** Props for SecOpsRiskThreatModel component */
export interface SecOpsRiskThreatModelProps {
  /**
   * Children of card
   * expect one h3 header and one p element and Target component
   * */
  children: React.ReactNode;
  /** href for card */
  href: string;
}

/** Card component which primarly wraps block with header and text as card  */
export default function SecOpsRiskThreatModel({ children, href }: SecOpsRiskThreatModelProps) {
  const isDesktopOrSmaller = useIsDesktopOrSmaller();
  const isTabletOrSmaller = useIsTabletOrSmaller();

  return (
    <ImageCard
      href={href}
      image={<Image src={umbrellaPic} alt={'umbrella picture'} placeholder="blur" />}
      isVertical={!isDesktopOrSmaller || isTabletOrSmaller}
      className={styles.secOpsImageCard}
    >
      {children}
    </ImageCard>
  );
}
