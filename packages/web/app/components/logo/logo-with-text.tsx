import React from 'react';
import EonianLogo from './logo';
import styles from './logo-with-text.module.scss';

import { InternalLink } from '../links/links';

const LogoWithText = () => (
  <InternalLink href="/" className={styles.logo} iconClassName={styles.logoIcon} icon={<EonianLogo />}>
    <span className={styles.name}>Eonian</span>
  </InternalLink>
);

export default LogoWithText;
