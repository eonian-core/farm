process.env.TS_ROOT = __dirname

module.exports = {
  extends: [
    '@eonian/eslint-config',
    'next/core-web-vitals',
    'plugin:storybook/recommended',
  ],
}
