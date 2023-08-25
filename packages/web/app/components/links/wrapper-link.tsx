import ExternalLink from './external-link';
import { LinkWithIconProps, InternalLink } from './links';

export const WrapperLink = ({ href, children, ...props }: LinkWithIconProps) => {
  if (href.toString().startsWith('/')) {
    return (
      <InternalLink href={href} {...props}>
        {children}
      </InternalLink>
    );
  }

  return (
    <ExternalLink href={href} {...props}>
      {children}
    </ExternalLink>
  );
};
