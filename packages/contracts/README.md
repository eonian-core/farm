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
yarn node
```

all scripts from `./deploy` folder will be executed during startup sequence

## Deploy

Fill in .env with enviroment variables required for deployment to your network

Then run the deployment command, in example we will dpeloy to ropstein network

```bash
npx hardhat --netowrk ropstein deploy
```

Deploy source files of contracts to etherscan

```bash
npx hardhat --network ropsten etherscan-verify
```

Deploy source files of contracts to sourcify

```bash
npx hardhat --network ropsten sourcify
```

Export abi and address in json format. Usefull for dApps

```bash
npx hardhat --network ropsten export './some-path'
```

## Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details, see [the](https://hardhat.org/guides/typescript.html#performance-optimizations) documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

## Deployed Contracts

### Ethereum Ropstein Testnet

<https://ropsten.etherscan.io/>

* "DefaultProxyAdmin" (tx: 0xe544ba74d5b06d17edf33789a11e9edfa31f3411ddce9b53b2171a15334fe5f5)...: deployed at 0x57a77442EF932e7a0E76D7ceeCCce136F0143FE7 with 643983 gas
* "SimpleGelatoJob_Implementation" (tx: 0xd47da4eafa32e287ea52dd76d1f3178a53cb5f9c92c56c314fbde69308d38282)...: deployed at 0xc3e8AD67C9B1EB8A764B4Df71b366EFdf1c1B959 with 1871453 gas
* "SimpleGelatoJob_Proxy" (tx: 0xc8ccb5bfde620aefd6eed5aa66e57e18cef57ac9f5e5137f732d5104ed1bd566)...: deployed at 0x8984C79185996220B71D06C0DEFEBCEC62fe33fC with 871149 gas
