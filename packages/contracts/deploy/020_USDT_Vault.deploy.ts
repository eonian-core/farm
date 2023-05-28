import { BigNumber } from "ethers";

import { deployUpgradable } from "../hardhat/deploy-upgradable";
import { BlockchainType, Stage } from "../hardhat.config";

/**
 * Deploy USDT Vault contract
 */
const func = deployUpgradable({
  contract: "Vault",
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Testnet,
    BlockchainType.Local,
  ],
  tags: ["asset:USDT"],
  getArgs: ({ accounts: { USDT, treasury }, stage }) => [
    USDT, // asset
    treasury, // rewards
    stage !== Stage.Production // managment fee
      ? 1500 // 15% for development and test versions
      : 2000, // 20% for production versions
    BigNumber.from("1" + "0".repeat(18)).div(3600), // 6 hours of locked profit release rate
    "Eonian USDT Vault Shares", // name
    "eonUSDT", // symbol
    [], // defaultOperators
  ],
});

export default func;
