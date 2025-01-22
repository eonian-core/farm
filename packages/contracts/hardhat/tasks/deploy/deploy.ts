import { task } from 'hardhat/config';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import { execute } from '@eonian/upgradeable';
import deployHealthCheck from '../../deployment/deployHealthCheck';
import deployVault from '../../deployment/deployVault';
import deployVFT from '../../deployment/deployVFT';
import { getStrategyDeploymentPlan, Strategy, getStrategyDeployer, StreategiesDeploymentPlan, getVaultsDeploymentPlan, VaultsDeploymentPlan } from './deployment-plan';
import _ from 'lodash';

export const deployTask = task('deploy', 'Deploy (or upgade) production contracts', async (args, hre) => {
  return await deployTaskAction(hre);
});

export async function deployTaskAction(
  hre: HardhatRuntimeEnvironment,
  vaultsDeploymentPlan = getVaultsDeploymentPlan(hre),
  strategyDeploymentPlan = getStrategyDeploymentPlan(hre)
) {
  console.log(`Strategy deployment plan: ${JSON.stringify(strategyDeploymentPlan)}`);

  if (vaultsDeploymentPlan.length <= 0) {
    console.log('No contracts to deploy, aborted');
    return;
  }

  console.log('\nDeploying common contracts...\n');
  await execute(deployHealthCheck, hre);

  console.log('\nDeploying token specific contracts...\n');
  await deployVaults(hre, vaultsDeploymentPlan);
  console.log('\nVaults deployed\n');
  await deployStrategies(hre, strategyDeploymentPlan);
  console.log('\nStrategies deployed\n');

  await hre.proxyValidator.validateLastDeployments();
  console.log('\nDeployment is done!\n');
}

async function deployVaults(hre: HardhatRuntimeEnvironment, deploymentPlan: VaultsDeploymentPlan){
  console.log(`\nVaults to deploy: ${deploymentPlan.join(', ')}`);

  for (const token of deploymentPlan) {
    console.log(`\nDeploying vault-related contracts for ${token}...\n`);
    await execute(deployVault, token, hre);
    await execute(deployVFT, token, hre);
  }
}

async function deployStrategies(hre: HardhatRuntimeEnvironment, deploymentPlan: StreategiesDeploymentPlan){
  const strategies = Object.keys(deploymentPlan) as Strategy[];
  if(!strategies.length) {
    console.log('No strategies in plan, will skip');
    return
  }

  console.log(`\nStrategies to deploy: ${strategies.join(', ')}`);
  for (const strategy of strategies) {
    console.log(`\nStarting to deploy ${strategy} strategy...`);

    const strategyTokens = deploymentPlan[strategy]!;
    for (const token of strategyTokens) {
      console.log(`Deploying ${strategy} strategy for ${token} token...`);

      const deployer = getStrategyDeployer(strategy, token);
      await execute(deployer, hre);
    }
  }
}