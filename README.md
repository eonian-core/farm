# Eonian Farm

Yield Aggregator dApp and protocol for safe and high reward liquidity mining

## Development

This monorepository contains protocol contracts and dApp code, as well as all related packages.

### Structure

* `packages/contracts` - Protocol contracts.
* `packages/web` - dApp package.

### Requirements

Install required tools for development

* [foundry](https://book.getfoundry.sh/getting-started/installation.html) - Testing framework for solidity
* [NodeJS](https://nodejs.org/) - Execution environment for JS

### First Start Guide

1) Install packages from npm and forge:

```bash
$ yarn
```

2) Fill in `packages/contract/foundry.toml` and `packages/contract/.env` with your etherscan url and API key

3) Run local node, compile and deploy contracts, start dApp:

```bash
$ yarn start
```

### Commands

* `yarn start` - start development enviroment
* `yarn test` - run tests in packages
* `yarn build:contracts` - Build only contracts
* `yarn test:contracts` - Test only contracts
* `dev:contracts` - Setup development enviroment for contracts. Watch files changes and rerun tests.


## TODO

[] Add event tests for ERC4626