import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// Contracts constructor args
// Ethereum Mainned
const GelatoOpsContractAddress = "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F";
// Ethereum Ropsten Testnet
// const GelatoOpsContractAddress = '0x9C4771560d84222fD8B7d9f15C59193388cC81B3';
const MinimumTimeBetweenExecutions = 1001; // seconds
const IsPrepayd = true;

// More contract addresses at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) {
  const accounts = await getNamedAccounts();
  console.log("deployer", accounts);

  const { deployer } = accounts;

  await deploy("SimpleGelatoJob", {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks,
    proxy: {
      owner: deployer,
      proxyContract: "OpenZeppelinTransparentProxy",
      execute: {
        methodName: "initialize",
        args: [
          GelatoOpsContractAddress,
          MinimumTimeBetweenExecutions,
          IsPrepayd,
        ],
      },
    },
  });
};

export default func;
func.tags = ["SimpleGelatoJob"];
