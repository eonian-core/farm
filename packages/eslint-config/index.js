"use strict";

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ["sonarjs"],
  extends: ["@antfu"],
  rules: {
    // Allows the global variable "process" to be used
    "n/prefer-global/process": ["error", "always"],

    // Enforces curly brackets everywhere (including the single statement under the "if" operator)
    curly: ["error", "all"],

    // Refer to https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
    "sonarjs/cognitive-complexity": "error",
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      extends: ["plugin:jest/recommended"],
      env: {
        jest: true,
      },
    },
  ],
};
