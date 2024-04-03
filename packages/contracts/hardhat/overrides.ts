import * as hardhatTypechain from '@typechain/ethers-v6/dist/codegen/hardhat'

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
