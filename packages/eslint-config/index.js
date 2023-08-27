module.exports = {
  plugins: ["sonarjs"],
  extends: ["./antfu.eslintrc.js"],
  rules: {
    // Allows the global variable "process" to be used
    "n/prefer-global/process": ["error", "always"],

    // Enforces curly brackets everywhere (including the single statement under the "if" operator)
    curly: ["error", "all"],

    // Refer to https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/cognitive-complexity.md
    "sonarjs/cognitive-complexity": "error",

    // Allows using destructing assignment to get methods
    "@typescript-eslint/unbound-method": "off",
  },
  overrides: [
    {
      // Reducing the strictness of checks in test files
      files: ["*.test.ts", "*.test.js", "*.spec.ts", "*.spec.js"],
      rules: {
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/require-await": "off",
      },
    },
  ],
};
