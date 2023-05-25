import { BigNumber } from "ethers";

import { deployUpgradable } from "../hardhat/deploy-upgradable";

const HOUR = 60 * 60; // hour in seconds

/**
 * Deploy USDT ApeSwap Lending strategy contract
 */
const func = deployUpgradable({
  contract: "ApeLendingStrategy",
  dependencies: ["Vault"],
  tags: ["asset:USDT"],
  getArgs: ({
    accounts: {
      apeSwap__cUSDT,
      gelatoOps,
      chainlink__BNB_USD_feed,
      chainlink__USDT_USD_feed,
    },
    stage,
    dependencies: [vault],
  }) => [
    vault.address,
    apeSwap__cUSDT, // cToken - lending market
    gelatoOps, // gelato coordination contract
    chainlink__BNB_USD_feed, // native token price feed
    chainlink__USDT_USD_feed, // asset token price feed
    6 * HOUR, // min report interval in seconds
    true, // Job is prepaid
  ],

  afterDeploy: async ({ ethers }, Strategy, [vault]) => {
    const Vault = await ethers.getContractAt("Vault", vault.address);

    Vault.addStrategy(Strategy.address, 10000); // 100% allocation
  },
});

export default func;
