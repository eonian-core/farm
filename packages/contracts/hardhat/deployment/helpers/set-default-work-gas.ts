import { Chain, needUseSafe, resolveChain, sendTxWithRetry, TokenSymbol } from '@eonian/upgradeable'
import { BaseContract } from 'ethers'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

/**
 * These numbers are median values and may (will) be different for different strategies.
 * Any value is better than default 0 and, if necessary, it can be set later.
 */
const ESTIMATED_WORK_GAS_PER_CHAIN: Record<Chain, bigint> = {
  [Chain.BSC]: 725000n,
  [Chain.ETH]: 530000n,
  [Chain.UNKNOWN]: 725000n,
}

/**
 * Sets the default amount of gas required to make “work” (harvest) strategy call.
 * Does not set the value if it is already exist (> 0n).
 */
export async function setDefaultWorkGas(hre: HardhatRuntimeEnvironment, contractName: string, strategyAddress: string, token: TokenSymbol) {
  const strategy = await hre.ethers.getContractAt('BaseStrategy', strategyAddress)
  const currentWorkGas = await strategy.estimatedWorkGas()
  if (currentWorkGas > 0n) {
    return
  }
  
  const chain = resolveChain(hre)
  const estimatedWorkGas = ESTIMATED_WORK_GAS_PER_CHAIN[chain]
  const name = await strategy.name()
  console.log(`[!] "estimatedWorkGas" missing for the "${name}", will try set it to ${estimatedWorkGas}`)
  
  await hre.proposeOrSendTx({
    sourceContractName: contractName,
    deploymentId: token,
    address: strategyAddress,
    contract: strategy as BaseContract,
    functionName: 'setEstimatedWorkGas',
    args: [estimatedWorkGas],
  })
  console.log(`[!] "estimatedWorkGas" was set to ${estimatedWorkGas} for the "${name}"`)
  
}
