import hre from 'hardhat'
import { expect } from 'chai'
import { ethers } from 'ethers'
import { expectImplementationMatch } from './asserts'
import { clearDeployments, deployContract } from './helpers'

describe('Deploy', () => {
  clearDeployments(hre)

  it('Should deploy proxy and implementation', async () => {
    const contractName = 'Stub_Contract'

    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])
    const { proxyAddress, implementationAddress } = await deployContract(contractName, Array.from(options.values()), hre)

    const contract = await hre.ethers.getContractAt(contractName, proxyAddress)

    await expectImplementationMatch(await contract.getAddress(), implementationAddress, hre)

    const integerA = await contract.integerA()
    const addressA = await contract.addressA()

    expect(options.get('integerA')).to.be.equal(integerA)
    expect(options.get('addressA')).to.be.equal(addressA)
  })

  it('Should deploy proxy and implementation (with inheritance)', async () => {
    const contractName = 'Stub_ContractChild'
    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
      ['integerB', ethers.toBigInt(200)],
      ['addressB', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
    ])
    const { proxyAddress, implementationAddress } = await deployContract(contractName, Array.from(options.values()), hre)

    const contract = await hre.ethers.getContractAt(contractName, proxyAddress)

    await expectImplementationMatch(await contract.getAddress(), implementationAddress, hre)

    const integerA = await contract.integerA()
    const addressA = await contract.addressA()
    const integerB = await contract.integerB()
    const addressB = await contract.addressB()

    expect(options.get('integerA')).to.be.equal(integerA)
    expect(options.get('addressA')).to.be.equal(addressA)
    expect(options.get('integerB')).to.be.equal(integerB)
    expect(options.get('addressB')).to.be.equal(addressB)
  })
})