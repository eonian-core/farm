# Eonian Farm

Yield Aggregator dApp and protocol for safe and high reward liquidity mining

## Development

This mono-repository contains protocol contracts and dApp code, as well as all related packages.

### Structure

* `packages/contracts` - Protocol contracts.
* `packages/web` - The dApp package.

### Requirements

Install required tools for development

* [Foundry](https://book.getfoundry.sh/getting-started/installation.html) - The testing framework for solidity
* [NodeJS](https://nodejs.org/) - Execution environment for JS

### First Start Guide

1) Install packages from npm and forge

```bash
yarn
```

2) Open the package which you want to start
    * `cd packages/web` - Open the dApp package
    * `cd packages/contract` - Open contracts package

3) Follow the guide of the package which you want to start
    * [web/readme.md](https://github.com/eonian-core/farm/tree/main/packages/web#readme)
    * [contracts/readme.md](https://github.com/eonian-core/farm/tree/main/packages/contracts#readme)

### Commands

* `yarn start` - start pre-prod environment
* `yarn dev` - start dev environment
* `yarn test` - run tests in packages
* `yarn build:contracts` - Build only contracts
* `yarn test:contracts` - Test only contracts
* `dev:contracts` - Set up a development environment for contracts. Watch file changes and rerun tests.

## Deployment

The deployment process focused on implementing GitOps practices. Basically, it means all master (main) builds go to production directly. For a web application, PRs also deploy to a preview environment.

### Deployed Apps

* <https:/eonian.finance> - Web app deployed Eonian DAO domain.
* <https://storybook-eonian.vercel.app> - Storybook of Web application components

