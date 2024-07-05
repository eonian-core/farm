import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol, execute, parseTokens } from '@eonian/upgradeable'
import deployHealthCheck from '../deployment/deployHealthCheck'
import deployVault from '../deployment/deployVault'
import deployApeLendingStrategy from '../deployment/deployApeLendingStrategy'
import deployVFT from '../deployment/deployVFT'

const defaultTokens = [
  TokenSymbol.USDC,
  TokenSymbol.USDT,
  TokenSymbol.BTCB,
  TokenSymbol.WETH,
]

export const deployTask = task('deploy', 'Deploy (or upgade) production contracts', async (args, hre) => {
  const tokens = parseTokens(args) ?? defaultTokens
  return await deployTaskAction(tokens, hre)
})

export async function deployTaskAction(tokens: TokenSymbol[], hre: HardhatRuntimeEnvironment) {
  console.log('Deploying common contracts...\n')

  await execute(deployHealthCheck, hre)

  for (const token of tokens) {
    console.log(`\nDeploying contracts for ${token}...\n`)
    await execute(deployVault, token, hre)
    await execute(deployApeLendingStrategy, token, hre)
    await execute(deployVFT, token, hre)
  }

  await hre.proxyValidator.validateLastDeployments()

  console.log('\nDeployment is done!\n')
}

