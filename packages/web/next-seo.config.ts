

import { NextSeoProps } from 'next-seo';

export interface PageSeoProps {
  title: string;
  description: string;
}

/** Override page specific SEO props for default config */
export const generatePageSpecificSeo = ({title, description}: PageSeoProps) => ({
  ...NEXT_SEO_DEFAULT,
  title,
  description,
  openGraph: {
    ...NEXT_SEO_DEFAULT.openGraph,
    title,
    description,
  },
});



export const NEXT_SEO_DEFAULT: NextSeoProps = {
  title: 'Eonian Protocol | Home',
  description: 'Decentralised and secure protocol for passive investments with peace in mind.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://eonian.finance/',
    title: 'Eonian | Crypto yield aggregator that cares security',
    description: 'Decentralised and secure protocol for passive investments with peace in mind.',
    images: [
      {
        url: 'https://eonian.finance/assets/preview-open-graph.png',
        width: 1024,
        height: 697,
        alt: 'Make crpto work for you',
        type: 'images/png',
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
