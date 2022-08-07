# Protocol contracts

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

## Development

### Kkown issues

* This project contains two `remappings.txt` files. It is caused by monorepo structure and plugin/foundry limitations.
  Root `remappings.txt` file is used by the `solidity` plugin,
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

For start local server with contracts (for example for dApp development) need start local node by command

```bash
yarn node
```

all scripts from `./deploy` folder will be executed during startup sequence

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

## Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

## Deployed Contracts

### Etherium Ropstein Testnet

<https://ropsten.etherscan.io/>

* "DefaultProxyAdmin" (tx: 0xe544ba74d5b06d17edf33789a11e9edfa31f3411ddce9b53b2171a15334fe5f5)...: deployed at 0x57a77442EF932e7a0E76D7ceeCCce136F0143FE7 with 643983 gas
* "SimpleGelatoJob_Implementation" (tx: 0xd47da4eafa32e287ea52dd76d1f3178a53cb5f9c92c56c314fbde69308d38282)...: deployed at 0xc3e8AD67C9B1EB8A764B4Df71b366EFdf1c1B959 with 1871453 gas
* "SimpleGelatoJob_Proxy" (tx: 0xc8ccb5bfde620aefd6eed5aa66e57e18cef57ac9f5e5137f732d5104ed1bd566)...: deployed at 0x8984C79185996220B71D06C0DEFEBCEC62fe33fC with 871149 gas