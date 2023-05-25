import { deployUpgradable } from "../hardhat/deploy-upgradable";

/**
 * Testing deploy of simple Gelato Job, only to test gelato or local fork
 */
const func = deployUpgradable({
  contract: "SimpleGelatoJob",
  isLocal: true,
  getArgs: ({ accounts: { gelatoOps } }) => [
    gelatoOps,
    1001, // minimum time between executions in seconds
    true, // is prepayed
  ],
});

export default func;
