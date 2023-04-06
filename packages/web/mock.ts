import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { addMocksToSchema } from '@graphql-tools/mock';
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    // Load schema from the file
    const schema = await loadSchema(join(__dirname, './schema.graphql'), {
        loaders: [new GraphQLFileLoader()]
    })

    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        schema: addMocksToSchema({ schema, mocks })
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
    BigDecimal: () => Math.random() * 10000000,
    BigInt: () => Math.floor(Math.random() * 10000000),
};