import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://api.thegraph.com/subgraphs/name/eonian-core/eonian-bsc-development',
  documents: 'app/**/*.{ts,tsx}',
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
    'app/api/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        strictScalars: true,
        scalars: {
          BigInt: 'bigint',
          Bytes: 'string',
          Int8: 'number',
          BigDecimal: 'string',
        },
      },
      plugins: [
        {
          '@eonian/graphql-typescript-scalar-type-policies': {
            scalarTypePolicies: {
              // File path should be relative to the generated "graphql.ts"
              BigInt: '../policies/bigIntPolicy#bigIntPolicy',
            },
          },
        },
      ],
    },
  },
}

export default config
