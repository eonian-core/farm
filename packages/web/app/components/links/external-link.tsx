import clsx from 'clsx';
import { LinkWithIconProps, LinkWithIcon } from './links';
import styles from './links.module.scss';

const ExternalLink = ({ href, className, ...props }: LinkWithIconProps) => (
  <LinkWithIcon
    href={href}
    target="_blank"
    rel="noopener noreferrer" // prevent tabnabbing
    className={clsx(styles.externalLink, className)}
    {...props}
  />
);

export default ExternalLink;
