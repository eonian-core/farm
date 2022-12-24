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

#### Smart Contracts

1) Install packages from npm and forge:

```bash
$ yarn
```

2) Fill in `packages/contract/foundry.toml` and `packages/contract/.env` with your etherscan url and API key

3) Run local node, compile and deploy contracts, start dApp:

```bash
yarn start
```

#### Web Application

To start only Web Application

1) Open web package

```bash
cd packages/web
```

2) Install dependencies

```bash
yarn
```

3) Start dev server

```bash
yarn dev
```

### Commands

* `yarn start` - start pre-prod enviroment
* `yarn dev` - start dev enviroment
* `yarn test` - run tests in packages
* `yarn build:contracts` - Build only contracts
* `yarn test:contracts` - Test only contracts
* `dev:contracts` - Setup development enviroment for contracts. Watch files changes and rerun tests.

## TODO

[x] Add event tests for ERC4626
[] add solhint in CI process
[] add test coverage in CI process
[] add more security validators in CI process
[] add optimizations in compilation process
[] add foundry to hardhat remappings support
[] silent warning for unused arguments in SafeERC4626 contract

# Colors

<https://tailwindcss.com/docs/customizing-colors>
Primary

* Indigo
* Fuchsia
* <https://uigradients.com/?utm_source=pocket_saves#Celestial>

Accent

* Amber
* <https://uigradients.com/?utm_source=pocket_saves#LearningandLeading>
* <https://uigradients.com/?utm_source=pocket_saves#LightOrange>
