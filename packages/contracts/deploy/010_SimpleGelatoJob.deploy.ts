import { BlockchainType } from "../hardhat.config";
import { deployOrUpgrade } from "../hardhat/deploy-or-upgrade";

/**
 * Testing deploy of simple Gelato Job, only to test gelato or local fork
 */
const func = deployOrUpgrade({
  contract: "SimpleGelatoJob",
  chains: [BlockchainType.Local],
  getArgs: ({ accounts: { gelatoOps } }) => [
    gelatoOps,
    1001, // minimum time between executions in seconds
    true, // is prepayed
  ],
});

export default func;
