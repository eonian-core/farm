

import { NextSeoProps } from 'next-seo';

export const NEXT_SEO_DEFAULT: NextSeoProps = {
  title: 'Eonian | Most safe crypto yield aggregator',
  description: 'Decentralised and secure protocol for passive investments with peace in mind.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://eonian.finance/',
    title: 'Eonian | Most safe crypto yield aggregator',
    description: 'Decentralised and secure protocol for passive investments with peace in mind.',
    images: [
      {
        url: 'https://eonian.finance/assets/preview-open-graph.png',
        width: 1024,
        height: 697,
        alt: 'Make crpto work for you',
        type: 'image/png',
      },
    ],
    siteName: 'Eonian DAO',
  },
  twitter: {
    handle: '@EonianFinance',
    site: '@EonianFinance',
    cardType: 'summary_large_image',
  },
};