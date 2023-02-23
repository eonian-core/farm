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
  description: 'Decentralized and secure protocol for passive investments with peace of mind.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://eonian.finance/',
    title: 'Eonian | Crypto yield aggregator that cares about security',
    description: 'Decentralized and secure real yeild protocol for passive investments with peace of mind.',
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
