import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { execute } from '@eonian/upgradeable'
import { mapValues } from 'lodash'
import deployHealthCheck from '../../deployment/deployHealthCheck'
import deployVault from '../../deployment/deployVault'
import deployVFT from '../../deployment/deployVFT'
import type { Addresses } from '../../deployment'
import { type DeployArguments, parseArguments, resolveStrategies } from './arguments'

export const deployTask = task('deploy', 'Deploy (or upgade) production contracts', async (args, hre) => {
  return await deployTaskAction(parseArguments(args), hre)
})

export async function deployTaskAction(args: DeployArguments, hre: HardhatRuntimeEnvironment) {
  console.log(`Starting "deploy" task with args: ${JSON.stringify(args)}`)

  const strategyToDeployDataLookup = await resolveStrategies(args, hre)
  const strategyToTokens = mapValues(strategyToDeployDataLookup, value => value!.tokens)
  console.log(`Resolved "strategy <-> tokens" relations to deploy: ${JSON.stringify(strategyToTokens)}`)

  const tokens = new Set(Object.values(strategyToTokens).flat())
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

  for (const strategy in strategyToDeployDataLookup) {
    console.log(`\nStarting to deploy ${strategy} strategy...`)
    const { deployer, tokens } = strategyToDeployDataLookup[strategy as Addresses]!
    for (const token of tokens) {
      console.log(`Deploying ${strategy} strategy for ${token} token...`)
      await execute(deployer, token, hre)
    }
  }

  await hre.proxyValidator.validateLastDeployments()

  console.log('\nDeployment is done!\n')
}
