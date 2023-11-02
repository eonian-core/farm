# Protocol contracts

It is a contracts package of Eonian Farm protocol.
It contains Vaults, Strategies, and all contracts on which they depend.

## Development

This package uses a complex setup of both hardhat and forge. They are both used for testing, but only hardhat is used for deployment.
It creates some complexities in the setup, but it simplifies and speedup testing of contracts.

* Hardhat tests are a threat as integration tests. They use RPC calls and uses JS. They are slower but required to test complex cases like investment strategies, which depend on contracts on the blockchain.
* Forge tests are a threat as unit tests. They are faster and actively use fuzz testing to increase test case coverage.

## First Start Guide

1) Install dependencies in the root of the repository

2) Fill in `.env` with your etherscan url and API key

3) Build contracts, run hardhat and forge tests

```bash,
yarn test
```

### Known issues

* This project contains two `remappings.txt` files. It is caused by monorepo structure and plugin/foundry limitations.
  The root `remappings.txt` file is used by the `solidity` plugin,
  but the second `remappings.txt` file in `contracts` folder is used by `forge` compiler.

### Commands

* `npx hardhat compile` - Compile contracts
* `npx hardhat accounts` - List development accounts
* `yarn test` - Run test
* `yarn dev` - Run tests in watch mode
* `npx hardhat test --trace` - shows logs + calls
* `npx hardhat test --fulltrace` - shows logs + calls + sloads + sstores
* `npx hardhat --network <networkName> deploy` - deploy contracts to specific network
* `npx hardhat --network <networkName> deploy --gasprice <number>` - deploy contracts to specific network with gas price

#### Rest of commands

```shell
npx hardhat clean
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

## Local Server

To start the local server with contracts (for example for dApp development) need start local node by command

```bash
yarn serve
```

all scripts from `./deploy` folder will be executed during startup sequence

## Deploy

Deploy can be done only through github CI/CD. Create PR to deploy your changes to Sepolia preview, merge it to `development` branch to deploy to dev environment and to `staging` later to deploy to staging environment.

Deploy consists two steps:
- Deploy contracts
- Verify contracts code

Later contract fails can cause information about deployment not will be saved. As a result, all deploy scripts must result in the same state, not matter how often they are triggered.

## Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details, see [the](https://hardhat.org/guides/typescript.html#performance-optimizations) documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

## Deployed Contracts

Deployed contracts addresses can be found in [deployments/deployed.ts](./deployments/deployed.ts) file.

## Related Protocols

* The project mainly utilize Gelato to trigger automated jobs.

## Tips
- How to enable ALL deploy-related logs in tests?
```
export HARDHAT_DEPLOY_LOG=true
export DEBUG=@openzeppelin:*
export DEBUG=hardhat:wighawag:*
```
line to remove later
