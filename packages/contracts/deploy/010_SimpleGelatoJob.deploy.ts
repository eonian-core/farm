import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

// Contracts constructor args
const GelatoOpsContractAddress = '0x0000000000000000000000000000000000000000';
const MinimumTimeBetweenExecutions = 1001; // seconds
const IsPrepayd = false;

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments: {deploy},
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