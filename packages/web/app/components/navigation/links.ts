import type { ResourceItem } from '../../features'
import { ResourcesLinks } from '../../features'

export const links = [
  ResourcesLinks.Mission,
  ResourcesLinks.Roadmap,
  ResourcesLinks.Community,
  ResourcesLinks.Security,
  ResourcesLinks.Earn,
  ResourcesLinks.Docs,
].filter(({ isEnabled }) => isEnabled)

export const mobileLinks: Array<ResourceItem> = [
  { href: '/', label: 'Home' },
  ...links,
]
