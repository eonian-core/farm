
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: "app/**/*.{ts,tsx}",
  generates: {
    "app/api/gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
