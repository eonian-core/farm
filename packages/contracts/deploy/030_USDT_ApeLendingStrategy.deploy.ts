import { deployOrUpgrade } from "../hardhat/deploy-or-upgrade";
import { BlockchainType } from "../hardhat.config";

const HOUR = 60 * 60; // hour in seconds

/**
 * Deploy USDT ApeSwap Lending strategy contract
 */
const func = deployOrUpgrade({
  contract: "ApeLendingStrategy",
  dependencies: ["Vault"],
  // Not possible to deploy on testnet, have wide range of thrid party protocols-dependencies
  chains: [BlockchainType.Mainnet, BlockchainType.Local],
  tags: ["asset:USDT"],
  getArgs: ({
    accounts: {
      apeSwap__cUSDT,
      gelatoOps,
      chainlink__BNB_USD_feed,
      chainlink__USDT_USD_feed,
    },
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

  afterDeploy: async ({ ethers, deployments: { log } }, Strategy, [vault]) => {
    log("Adding strategy to vault");
    const Vault = await ethers.getContractAt("Vault", vault.address);

    const tx = await Vault.addStrategy(Strategy.address, 10000); // 100% allocation
    const result = await tx.wait();
    log("Strategy added to vault", result);
  },
});

export default func;
