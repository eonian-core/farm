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

## Deployment

Deplyment process focused to implement GitOps practices. Basically it means all master (main) builds go to production directly. For web applications PRs also deploys to preview enviroment.

### Deployed Apps

* <https:/eonian.finance> - Web app deployed Eonian DAO domain.
* <https://storybook-eonian.vercel.app> - Storybook of Web application components

### CDN

* <https://vercel.com/eonian/farm-app> - Web app project in Vercel
* <https://vercel.com/eonian/storybook> - Storybook project in Vercel
