
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: "app/**/*.tsx",
  generates: {
    "app/api/gql": {
      preset: "client",
      plugins: []
    },
    "./schema.graphql.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
