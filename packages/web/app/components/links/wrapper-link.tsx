import ExternalLink from './external-link'
import type { LinkWithIconProps } from './links'
import { InternalLink } from './links'

export function WrapperLink({ href, children, ...props }: LinkWithIconProps) {
  if (href.toString().startsWith('/') || href.toString().startsWith('#')) {
    return <InternalLink href={href} {...props}>{children}</InternalLink>
  }
  return <ExternalLink href={href} {...props}>{children}</ExternalLink>
}
