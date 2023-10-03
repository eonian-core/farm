import hre from 'hardhat'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { Manifest } from '@openzeppelin/upgrades-core'
import { clearDeployments, deployContract, manageArtifacts } from './helpers'

describe('OZ Manifest file', () => {
  const { replaceArtifacts } = manageArtifacts(hre)

  clearDeployments(hre)

  it('Should create openzeppelin manifest file', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }
    const { address, implementation } = await deployContract('Stub_Contract', options, hre)

    const manifest = await Manifest.forNetwork(hre.ethers.provider)

    const implementationData = await manifest.getDeploymentFromAddress(implementation!)
    expect(implementationData.address).to.be.equal(implementation!)

    const proxyData = await manifest.getProxyFromAddress(address)
    expect(proxyData.address).to.be.equal(address)
  })

  it('Should not update openzeppelin manifest file if contract did not changed', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }
    await deployContract('Stub_Contract', options, hre)

    const manifestA = await Manifest.forNetwork(hre.ethers.provider)
    const manifestContentA = JSON.stringify(await manifestA.read())

    await deployContract('Stub_Contract', options, hre)

    const manifestB = await Manifest.forNetwork(hre.ethers.provider)
    const manifestContentB = JSON.stringify(await manifestB.read())

    expect(manifestContentA).to.be.equal(manifestContentB)
  })

  it('Should extend openzeppelin manifest file after upgrade', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }

    const deployResult = await deployContract('Stub_Contract', options, hre)

    console.log(deployResult.address, deployResult.implementation)

    const manifestA = await Manifest.forNetwork(hre.ethers.provider)
    expect((await manifestA.getProxyFromAddress(deployResult.address)).address).to.be.equal(deployResult.address)
    expect((await manifestA.getDeploymentFromAddress(deployResult.implementation!)).address).to.be.equal(deployResult.implementation!)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract('Stub_Contract', options, hre)

    const manifestB = await Manifest.forNetwork(hre.ethers.provider)
    expect((await manifestB.getProxyFromAddress(upgradeResult.address)).address).to.be.equal(upgradeResult.address)
    expect((await manifestB.getDeploymentFromAddress(upgradeResult.implementation!)).address).to.be.equal(upgradeResult.implementation!)
    expect((await manifestB.getDeploymentFromAddress(deployResult.implementation!)).address).to.be.equal(deployResult.implementation!)

    expect(deployResult.address).to.be.equal(upgradeResult.address)
  })
})
