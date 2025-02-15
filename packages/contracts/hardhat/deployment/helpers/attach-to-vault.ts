import type { TokenSymbol } from '@eonian/upgradeable'
import { needUseSafe, sendTxWithRetry } from '@eonian/upgradeable'
import type { BaseContract } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

const MAX_DEBT_RATIO_IN_BPS = 10000n

export async function attachToVault(
  contractName: string,
  strategyAddress: string,
  token: TokenSymbol,
  vaultAddress: string,
  hre: HardhatRuntimeEnvironment,
) {
  console.log(`Attaching strategy to vault:\n\tStrategy: ${strategyAddress}\n\tVault: ${vaultAddress}`)

  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)

  const vaultDebtRatio = await vault.debtRatio()
  const debtRatio = MAX_DEBT_RATIO_IN_BPS - vaultDebtRatio
  const addStrategyArgs: [string, bigint] = [strategyAddress, debtRatio]

  if (needUseSafe()) {
    await hre.proposeSafeTransaction({
      sourceContractName: contractName,
      deploymentId: token,
      address: vaultAddress,
      contract: vault as BaseContract,
      functionName: 'addStrategy',
      args: addStrategyArgs,
    })
  }
  else {
    await sendTxWithRetry(() => vault.addStrategy(...addStrategyArgs))
  }

  console.log(`Strategy attached successfully with ratio: ${debtRatio}!`)
  if (debtRatio === 0n) {
    console.log('Debt ratio of the strategy is 0, so it\'s not active. You should adjust it manually!')
  }
}
