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
yarn
```

2) Open package which you want to start
    * `cd packages/web` - Open dApp package
    * `cd packages/contract` - Open contracts package

3) Follow the guide of the package which you want to start
    * [web/readme.md](https://github.com/eonian-core/farm/tree/main/packages/web#readme)
    * [contracts/readme.md](https://github.com/eonian-core/farm/tree/main/packages/contracts#readme)

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

Deployment process focused on implementing GitOps practices. Basically, it means all master (main) builds go to production directly. For a web application, PRs also deploy to a preview environment.

### Deployed Apps

* <https:/eonian.finance> - Web app deployed Eonian DAO domain.
* <https://storybook-eonian.vercel.app> - Storybook of Web application components

