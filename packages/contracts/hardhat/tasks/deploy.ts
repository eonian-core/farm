import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { TokenSymbol } from '../types'
import { type DeployResult, DeployStatus } from '../deployment/plugins/Deployer'
import deployHealthCheck from '../deployment/deployHealthCheck'
import deployVault from '../deployment/deployVault'
import deployApeLendingStrategy from '../deployment/deployApeLendingStrategy'
import deployVFT from '../deployment/deployVFT'

export const deployTask = task('deploy', 'Deploy (or upgade) production contracts', async (args: unknown[], hre: HardhatRuntimeEnvironment) => {
  return await deployTaskAction(
    [
      TokenSymbol.USDC,
      TokenSymbol.USDT,
      TokenSymbol.BTCB,
      TokenSymbol.WETH,
    ],
    hre,
  )
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

  console.log('\nDeployment is done!\n')
}

async function execute<R extends DeployResult, T extends (...args: any) => Promise<R>>(fn: T, ...args: Parameters<T>): Promise<R> {
  const fnArgs = Array.from(args).filter(arg => typeof arg !== 'object').join(', ').trim()
  const contractName = (fnArgs ? `${fnArgs} ` : '') + (fn.name.startsWith('deploy') ? fn.name.substring(6) : fn.name)
  console.log(`[${contractName}] Deploying contract via <${fn.name}>...`)

  // eslint-disable-next-line prefer-spread
  const result = await fn.apply(null, args)
  switch (result.status) {
    case DeployStatus.NONE:
      console.log(`[${contractName} - SKIP] Proxy ${result.proxyAddress} is up-to-date`)
      break
    case DeployStatus.DEPLOYED:
      console.log(`[${contractName} - NEW PROXY] Proxy ${result.proxyAddress} is deployed, verified: ${result.verified}.`)
      break
    case DeployStatus.UPGRADED:
      console.log(`[${contractName} - UPGRADED] Proxy ${result.proxyAddress} is upgraded, verified: ${result.verified}.`)
      break
  }

  return result
}
