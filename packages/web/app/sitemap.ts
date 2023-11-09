import { ResourcesLinks } from './features'

type Sitemap = Array<{
  url: string
  lastModified?: string | Date
}>

export const DOMAIN = 'https://eonian.finance'
const currentDate = new Date()

export default function sitemap(): Sitemap {
  return Object.values(ResourcesLinks)
    .filter(({ external, isEnabled }) => !external && isEnabled)
    .map(link => ({
      url: `${DOMAIN}${link.href}`,
      lastModified: currentDate,
    }))
}
