import type { MetadataRoute } from 'next'
import { DOMAIN } from './sitemap'

/** Robots.txt required to make sitemap available for crawlers */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}
