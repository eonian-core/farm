import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// Contracts constructor args
// Etherium Mainned
const GelatoOpsContractAddress = '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F';
const MinimumTimeBetweenExecutions = 1001; // seconds
const IsPrepayd = false;

// More contract addresses at https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub/contract-addresses

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments: { deploy },
}: HardhatRuntimeEnvironment) {

  const { deployer } = await getNamedAccounts();


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
          IsPrepayd
        ],
      },
    },
  });
};

export default func;
func.tags = ["SimpleGelatoJob"];