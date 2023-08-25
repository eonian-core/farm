import { Metadata } from 'next';

export const overrideMetadata = (title: string, description: string): Metadata => ({
  title,
  description,
  openGraph: {
    description,
    title,
  },
});
