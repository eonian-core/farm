import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { expect } from 'chai'

export async function expectImplementationMatch(address: string, implementation: string | undefined, hre: HardhatRuntimeEnvironment) {
  const erc1967Implementation = await hre.upgrades.erc1967.getImplementationAddress(address)
  expect(erc1967Implementation).to.be.equal(implementation)
}
