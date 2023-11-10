import hre from 'hardhat'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import type { Stub_Contract, Stub_ContractChild } from '../../typechain-types'
import { expectImplementationMatch } from './asserts'
import { clearDeployments, deployContract } from './helpers'

describe('Deploy', () => {
  clearDeployments(hre)

  it('Should deploy proxy and implementation', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }
    const { name, implementation } = await deployContract('Stub_Contract', options, hre)

    const contract = await hre.ethers.getContract<Stub_Contract>(name)

    await expectImplementationMatch(contract.address, implementation, hre)

    const integerA = await contract.integerA()
    const addressA = await contract.addressA()

    expect(options.integerA).to.be.equal(integerA)
    expect(options.addressA).to.be.equal(addressA)
  })

  it('Should deploy proxy and implementation (with inheritance)', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      integerB: BigNumber.from(200),
      addressB: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    }
    const { name, implementation } = await deployContract('Stub_ContractChild', options, hre)

    const contract = await hre.ethers.getContract<Stub_ContractChild>(name)

    await expectImplementationMatch(contract.address, implementation, hre)

    const integerA = await contract.integerA()
    const addressA = await contract.addressA()
    const integerB = await contract.integerB()
    const addressB = await contract.addressB()

    expect(options.integerA).to.be.equal(integerA)
    expect(options.addressA).to.be.equal(addressA)
    expect(options.integerB).to.be.equal(integerB)
    expect(options.addressB).to.be.equal(addressB)
  })
})
