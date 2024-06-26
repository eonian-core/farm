# Subgraph for Eonian

This is Subgraph package for Eonian yield aggregator.

## Requirements

* Docker - required for local testing
* JQ - <https://howtoinstall.co/en/jq> 


## First Start guide

1. Install dependencies

```bash
yarn
```

2. Test subgraph, by default will run in Docker

```bash
yarn test
```

## Known Issues

In case of error `binary-install-raw/bin/0.5.4/binary-linux-20: error while loading shared libraries: libpq.so.5: cannot open shared object file: No such file or directory` during `yarn test` you need to install postgres. [Why is it needed?](https://thegraph.com/docs/en/developing/unit-testing-framework/).

```bash
sudo apt install postgresql
```

## Local Development

[More info](https://thegraph.academy/developers/local-development/)

## Subgraphs

* [Sepolia Testnet](https://thegraph.com/studio/subgraph/eonian-sepolia-testnet/)
* [BSC Development](https://thegraph.com/hosted-service/subgraph/eonian-core/eonian-bsc-development)
* [BSC Staging](https://thegraph.com/hosted-service/subgraph/eonian-core/eonian-bsc-staging)

### Queries urls

* [Sepolia Testnet](https://api.studio.thegraph.com/query/48141/eonian-sepolia-testnet/version/latest)
* [BSC Development](https://api.thegraph.com/subgraphs/name/eonian-core/eonian-bsc-development)
* [BSC Staging](https://api.thegraph.com/subgraphs/name/eonian-core/eonian-bsc-staging)

## Deploy

[More info](https://thegraph.com/docs/en/cookbook/quick-start/#5-deploy-to-the-subgraph-studio)

1. Update version in `package.json`

2. Run command
```bash
yarn deploy
```

3. Test subgraph in the deployed playground.
4. Click deploy in the subgraph studio.

## Development Notes

* For naming files, use only lowercase letters and dashes. For example, `vault-service.ts` instead of `VaultService.ts`. AssemblyScripts transpile files to lowercase, so using uppercase letters can get different names in error messages or even name conflicts.
