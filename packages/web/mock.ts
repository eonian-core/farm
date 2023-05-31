import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  MockList,
  addMocksToSchema,
  createMockStore,
} from "@graphql-tools/mock";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import {
  mocks as scalarsMocks,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import { Vault } from "./app/api/gql/graphql";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Load schema from the file
  const schema = await loadSchema(join(__dirname, "./schema.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });

  const store = createMockStore({ schema });
  store.set("Query", "ROOT", "vaults", [
    {
      name: "Ethereum Vault",
      symbol: "eonETH",
      underlyingAsset: {
        name: "Ethereum",
        symbol: "ETH",
      },
    },
    {
      name: "Bitcoin Vault",
      symbol: "eonBTC",
      underlyingAsset: {
        name: "Bitcoin",
        symbol: "BTC",
      },
    },
    {
      name: "USDT Vault",
      symbol: "eonUSDT",
      underlyingAsset: {
        name: "Tether USD",
        symbol: "USDT",
      },
    },
  ] as Partial<Vault>);

  const server = new ApolloServer({
    schema: addMocksToSchema({ schema, store, mocks, resolvers }),
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`
╭───────────────────────────────────────────────────╮
│                                                   │
│           🚀 Mocking server started!              │
│                                                   │
│    Local:            ${url}       │
│                                                   │
╰───────────────────────────────────────────────────╯
    `);
}

main();

const mocks = {
  ...scalarsMocks,
  BigDecimal: scalarsMocks.BigInt,
};

const resolvers = {
  BigInt: scalarResolvers.BigInt,
  BigDecimal: scalarResolvers.BigInt,
  Vault: {
    address: () => "0x0000000000000000000000000000000000000000",
  },
  UnderlyingAsset: {
    address: () => "0x0000000000000000000000000000000000000000",
  },
};
