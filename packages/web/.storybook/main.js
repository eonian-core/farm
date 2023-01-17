const path = require('path');
module.exports = {
  "stories": [
    "../(app|stories)/**/*.mdx",
    "../(app|stories)/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },
  "docs": {
    "autodocs": "tag"
  },
  "features": {
    "storyStoreV7": true,
  }
}