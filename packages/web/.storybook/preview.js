import React from 'react';
import { Roboto } from "next/font/google";

import '../app/globals.scss';

const roboto = Roboto({ 
  subsets: ['latin', 'cyrillic'], 
  weight: ['300', '400'],
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
      <style jsx global>{`
        .story-wrapper, .docs-story {
          background-color: var(--color-background-start);
          width: 100%;
          height: 100%;
        }
      `}</style>
      
    </div>
  ),
];

export const globalTypes = {
  pseudo: {}
};
