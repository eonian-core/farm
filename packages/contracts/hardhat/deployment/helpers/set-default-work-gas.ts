import { Chain, resolveChain } from '@eonian/upgradeable'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

/**
 * These numbers are median values and may (will) be different for different strategies.
 * Any value is better than default 0 and, if necessary, it can be set later.
 */
const ESTIMATED_WORK_GAS_PER_CHAIN: Record<Chain, bigint> = {
  [Chain.BSC]: 725000n,
  [Chain.ETH]: 530000n,
  [Chain.UNKNOWN]: 500000n,
}

/**
 * Sets the default amount of gas required to make “work” (harvest) strategy call.
 * Does not set the value if it is already exist (> 0n).
 */
export async function setDefaultWorkGas(hre: HardhatRuntimeEnvironment, strategyAddress: string) {
  const strategy = await hre.ethers.getContractAt('BaseStrategy', strategyAddress)
  const currentWorkGas = await strategy.estimatedWorkGas()
  if (currentWorkGas > 0n) {
    return
  }
  const chain = resolveChain(hre)
  const estimatedWorkGas = ESTIMATED_WORK_GAS_PER_CHAIN[chain]
  await strategy.setEstimatedWorkGas(estimatedWorkGas)
  const name = await strategy.name()
  console.log(`[!] "estimatedWorkGas" was set to ${estimatedWorkGas} for the "${name}"`)
}
