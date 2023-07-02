import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./apollo/schema.graphql",
  documents: "app/**/*.{ts,tsx}",
  generates: {
    "app/api/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
        strictScalars: true,
        scalars: { BigInt: "bigint" },
      },
      plugins: [
        {
          "@eonian/graphql-typescript-scalar-type-policies": {
            scalarTypePolicies: {
              // File path should be relative to the generated "graphql.ts"
              BigInt: "../policies/bigIntPolicy#bigIntPolicy",
            },
          },
        },
      ],
    },
  },
};

export default config;
