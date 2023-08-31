process.env.TS_ROOT = __dirname

module.exports = {
  extends: ['@eonian/eslint-config'],
  rules: {
    // Allows "unnecessary" type assertions, since it is crucial part of AssemblyScript
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',

    // Allows using "BigInt" as a type (instead of "bigint")
    '@typescript-eslint/ban-types': 'off',

    // Type imports are not available in AssemblyScript
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],

    // Allows using "Math.pow"
    'prefer-exponentiation-operator': 'off',
  },
}
