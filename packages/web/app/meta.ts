import type { Metadata } from 'next'

export function overrideMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      description,
      title,
    },
  }
}
