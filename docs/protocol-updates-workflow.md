# Protocol Updates Integration Workflow

To make protocol updates safe and smooth, we have designed this workflow. The workflow mainly consists of two parts: **Development** and **Integration**. Both of them are used to test and verify the protocol changes before the majority of users will see them.

## Development

These stages are mainly reviewed and verified by the development team. The main goal of these stages is to test changes as fast as possible and fix all critical bugs which can cause significant protocol degradation.

### Local Development

This stage is used to test changes locally. It is the fastest way to test changes, but it cannot be used to verify changes on the real blockchain. 

Changes tested locally on forked mainnet blockchain. Changes tested through the automated unit and integration tests. Additional manual tests with interaction with dApp are also performed.

> The same forked blockchain version with [automated tests is used in CI/CD pipeline](https://github.com/eonian-core/farm/actions/workflows/verify-smart-contracts.yaml) to ensure all changes are tested before they will be merged to the main branch.

### Testnet / Preview

This stage is used to test changes on testnet. It is the fastest and cheapest way to test changes on the blockchain, but testnet does not have the same protocols on which Strategies usually depend. This limitation allows us to test only part of the changes, Vaults related mainly.

Changes deployed from GitHub PRs, which include changes related to contracts. Current testnet is [Sepolia](https://sepolia.etherscan.io/).

### Mainnet / Development

This stage is used to test changes on mainnet. Changes are merged and deployed directly to mainnet (currently only BSC) and then tested through an application accessible by the development team only. This stage allows developers to verify new updates by using real money but not risk any users' funds.

Changes deployed from Github by merging PR to [the development branch](https://github.com/eonian-core/farm/tree/development). 

## Integration

At this moment, changes have already been prepared and verified by the development team. During this part of the workflow, the development team and testers' community interact with the protocol. The main goal of this part is to verify changes on the real blockchain and deeper test interactions with protocols on which Eonian depends.

### Mainnet / Staging

This stage is used to test changes on mainnet more deeply with a higher amount of users and different use cases. Changes are reviewed in PR, then merged and deployed directly to mainnet. They are then tested through an application accessible by the development team and testers' community only.

This stage is usually already safe enough to use but still can have some bugs. On the other hand, new investment strategies arrive at this stage faster than production, making the APY and overall profit higher.
Additionally, at this stage, the protocol has lower fees, 15%, in comparison to 20% on production. This is a natural incentive for testers to use this stage and reward them for their work.

Changes deployed from Github by merging PR to [the staging branch](https://github.com/eonian-core/farm/tree/stagging). 

### Mainnet / Production

This is the final version of the application, which is publicly accessable. After changes are tested on previous stages, they are reviewed again and then deployed to the production mainnet version.

In the future, this stage will include a time lock for updates and will require community voting to approve changes. At the current moment, the protocol is heavily developed, with new features and changes arriving often. To not slow down development and have the ability to apply security patches without any delays, we decided not to use a time lock at this right now.
