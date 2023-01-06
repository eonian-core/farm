import React from 'react';
import { Roboto } from "@next/font/google";

import '../app/globals.scss';
import '../app/tailwind.css'

const roboto = Roboto({ 
  subsets: ['latin', 'cyrillic'], 
  weight: ['300', '400', '500', '700', '900'],
  display: 'block' // force to show font anyway
})


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <div className={roboto.className}>
      <Story />
      <style global jsx>{`
        .docs-story {
          background-color: var(--color-background-start);
        }
      `}</style>
    </div>
  ),
];