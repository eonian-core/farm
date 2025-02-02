import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { execute } from '@eonian/upgradeable'
import _ from 'lodash'
import deployHealthCheck from '../../deployment/deployHealthCheck'
import deployVault from '../../deployment/deployVault'
import deployVFT from '../../deployment/deployVFT'
import type { Strategy, StrategyDeploymentPlan } from './strategy-deployment-plan'
import { getStrategyDeployer, getStrategyDeploymentPlan } from './strategy-deployment-plan'

export const deployTask = task('deploy', 'Deploy (or upgade) production contracts', async (args, hre) => {
  const strategyDeploymentPlan = getPlanFromArguments(args) ?? getStrategyDeploymentPlan(hre)
  return await deployTaskAction(hre, strategyDeploymentPlan)
})

export async function deployTaskAction(
  hre: HardhatRuntimeEnvironment,
  strategyDeploymentPlan: StrategyDeploymentPlan,
) {
  console.log(`Strategy deployment plan: ${JSON.stringify(strategyDeploymentPlan)}`)

  const tokens = new Set(Object.values(strategyDeploymentPlan).flat())
  if (tokens.size <= 0) {
    console.log('No contracts to deploy, aborted')
    return
  }

  console.log('\nDeploying common contracts for...\n')

  await execute(deployHealthCheck, hre)

  for (const token of tokens) {
    console.log(`\nDeploying vault-related contracts for ${token}...\n`)
    await execute(deployVault, token, hre)
    await execute(deployVFT, token, hre)
  }

  const strategies = Object.keys(strategyDeploymentPlan) as Strategy[]
  for (const strategy of strategies) {
    console.log(`\nStarting to deploy ${strategy} strategy...`)

    const strategyTokens = strategyDeploymentPlan[strategy]!
    for (const token of strategyTokens) {
      console.log(`Deploying ${strategy} strategy for ${token} token...`)

      const deployer = getStrategyDeployer(strategy, token)
      await execute(deployer, hre)
    }
  }

  await hre.proxyValidator.validateLastDeployments()

  console.log('\nDeployment is done!\n')
}

/**
 * Gets strategy deployment plan from the hardhat task arguments. Used in tests only.
 * Production plan is declared in separate file (strategy-deployment-plan.ts).
 */
function getPlanFromArguments(args: unknown): StrategyDeploymentPlan | null {
  if (typeof args === 'object' && !!args && 'plan' in args && typeof args.plan === 'string') {
    return JSON.parse(args.plan) as StrategyDeploymentPlan
  }
  return null
}
