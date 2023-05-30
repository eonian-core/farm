import { HardhatRuntimeEnvironment } from "hardhat/types";
import { expect } from "chai";

import { BlockchainType } from "../../hardhat.config";
import { skipFactory } from "../../hardhat/deploy-or-upgrade";

describe("skipFactory", () => {
  it("should return true if none of the expected blockchains is present in network tags", async () => {
    const network = {
      config: {
        tags: [BlockchainType.Testnet, BlockchainType.Local],
      },
    };
    const chains = [BlockchainType.Mainnet];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(true);
  });

  it("should return false if at least one of the expected blockchains is present in network tags", async () => {
    const network = {
      config: {
        tags: [BlockchainType.Testnet, BlockchainType.Mainnet],
      },
    };
    const chains = [BlockchainType.Mainnet];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(false);
  });

  it("should return false if all of the expected blockchains are present in network tags", async () => {
    const network = {
      config: {
        tags: [
          BlockchainType.Testnet,
          BlockchainType.Mainnet,
          BlockchainType.Local,
        ],
      },
    };
    const chains = [
      BlockchainType.Local,
      BlockchainType.Testnet,
      BlockchainType.Mainnet,
    ];

    const shouldSkip = await skipFactory(chains)({ network } as any);

    expect(shouldSkip).to.be.equal(false);
  });
});
