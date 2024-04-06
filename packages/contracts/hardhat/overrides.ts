import * as hardhatTypechain from '@typechain/ethers-v6/dist/codegen/hardhat'
import { extendEnvironment } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type AvailableHardhatNetwork, Chain, getChainForFork } from './types'

const generateHardhatHelper = hardhatTypechain.generateHardhatHelper

// @ts-expect-error Extends typechain generation logic to create union types from contracts (artifacts) names.
hardhatTypechain.generateHardhatHelper = function (names: string[]) {
  return `
    ${generateHardhatHelper(names)}
    declare module "hardhat/types/runtime" {
      type ContractName = ${names.sort().map(name => `'${name}'`).join(' | ')}
    }
  `
}

// Just prints the information about current network at the start.
extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  const network = hre.network.name as AvailableHardhatNetwork

  let label: string = network
  if (network === 'hardhat') {
    const chainFork = getChainForFork()
    label = chainFork === Chain.UNKNOWN ? label : `${label} (fork: ${chainFork})`
  }

  console.log(`Using "${label}" network...`)
})
