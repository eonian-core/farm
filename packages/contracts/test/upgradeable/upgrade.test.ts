import hre from 'hardhat'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { ValidationError } from '@eonian/upgradeable'
import type { Stub_Contract, Stub_ContractChild, Stub_ContractChildSimpleUpgrade, Stub_ContractSimpleUpgrade } from '../../typechain-types'
import { expectImplementationMatch } from './asserts'
import { clearDeployments, deployContract, getDeploymentEvents, manageArtifacts } from './helpers'

describe('Upgrade', () => {
  const { replaceArtifacts, resetArtifacts } = manageArtifacts(hre)

  clearDeployments(hre)

  it('Should deploy and upgrade proxy (check upgrade events)', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }

    const deployResult = await deployContract('Stub_Contract', options, hre)

    await expectImplementationMatch(deployResult.address, deployResult.implementation, hre)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract('Stub_Contract', options, hre)

    await expectImplementationMatch(upgradeResult.address, upgradeResult.implementation, hre)

    expect(upgradeResult.address).to.be.equal(deployResult.address)
    expect(upgradeResult.implementation).not.to.be.equal(deployResult.implementation)

    const upgradedEvents = await getDeploymentEvents(upgradeResult, 'Upgraded', hre)
    expect(upgradedEvents.length).to.be.equal(2)
    expect(upgradedEvents[0].args?.[0]).to.be.equal(deployResult.implementation)
    expect(upgradedEvents[1].args?.[0]).to.be.equal(upgradeResult.implementation)
  })

  it('Should deploy and upgrade proxy', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }

    const deployResult = await deployContract('Stub_Contract', options, hre)

    const contractBeforeUpgrade = await hre.ethers.getContractAt<Stub_Contract>(deployResult.abi, deployResult.address)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(options.integerA)
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(options.addressA)

    // Set values to new ones
    const newIntegerA = 333
    const newAddressA = '0x000000000000000000000000000000000000dEaD'
    await contractBeforeUpgrade.setIntegerA(newIntegerA)
    await contractBeforeUpgrade.setAddressA(newAddressA)
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(newIntegerA)
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(newAddressA)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract('Stub_Contract', options, hre)

    const contractAfterUpgrade = await hre.ethers.getContractAt<Stub_ContractSimpleUpgrade>(upgradeResult.abi, upgradeResult.address)

    const newIntegerB = 500
    await contractAfterUpgrade.setIntegerB(newIntegerB)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).to.be.equal(newIntegerA)
    expect(await contractAfterUpgrade.addressA()).to.be.equal(newAddressA)
    expect(await contractAfterUpgrade.integerB()).to.be.equal(newIntegerB)
  })

  it('Should deploy and upgrade proxy (with inheritance)', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      integerB: BigNumber.from(200),
      addressB: '0x000000000000000000000000000000000000dEaD',
    }

    const deployResult = await deployContract('Stub_ContractChild', options, hre)

    const contractBeforeUpgrade = await hre.ethers.getContractAt<Stub_ContractChild>(deployResult.abi, deployResult.address)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(options.integerA)
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(options.addressA)
    expect(await contractBeforeUpgrade.integerB()).to.be.equal(options.integerB)
    expect(await contractBeforeUpgrade.addressB()).to.be.equal(options.addressB)

    await replaceArtifacts('Stub_ContractChildSimpleUpgrade', 'Stub_ContractChild')

    const upgradeResult = await deployContract('Stub_ContractChild', options, hre)

    const contractAfterUpgrade = await hre.ethers.getContractAt<Stub_ContractChildSimpleUpgrade>(upgradeResult.abi, upgradeResult.address)

    const newIntegerC = 500
    await contractAfterUpgrade.setIntegerC(newIntegerC)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).to.be.equal(options.integerA)
    expect(await contractAfterUpgrade.addressA()).to.be.equal(options.addressA)
    expect(await contractAfterUpgrade.integerB()).to.be.equal(options.integerB)
    expect(await contractAfterUpgrade.addressB()).to.be.equal(options.addressB)
    expect(await contractAfterUpgrade.integerC()).to.be.equal(newIntegerC)
  })

  it('Should validate storage layout before upgrade', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    }

    await deployContract('Stub_Contract', options, hre)

    await replaceArtifacts('Stub_ContractInvalidUpgrade', 'Stub_Contract')

    await expect(deployContract('Stub_Contract', options, hre)).to.be.rejectedWith(ValidationError)
  })

  it('Should validate storage layout before upgrade (with inheritance)', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      integerB: BigNumber.from(200),
      addressB: '0x000000000000000000000000000000000000dEaD',
    }

    await deployContract('Stub_ContractChild', options, hre)

    await replaceArtifacts('Stub_ContractChildWithInvalidParent', 'Stub_ContractChild')

    await expect(deployContract('Stub_ContractChild', options, hre)).to.be.rejectedWith(ValidationError)
  })

  it('Should skip validation if "SKIP_UPGRADE_VALIDATION" is set', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      integerB: BigNumber.from(200),
      addressB: '0x000000000000000000000000000000000000dEaD',
    }

    await deployContract('Stub_ContractChild', options, hre)

    await replaceArtifacts('Stub_ContractChildWithInvalidParent', 'Stub_ContractChild')

    process.env.SKIP_UPGRADE_VALIDATION = 'true'

    await expect(deployContract('Stub_ContractChild', options, hre)).to.not.be.rejectedWith(ValidationError)
  })

  /**
   * Simulates the case where we accidentally violated the contract by upgrading with an unnecessary reduced gap,
   * and then try to fix it by upgrading with a fixed (originally correct) implementation.
   */
  it('Should return valid memory layout after fixed contract deployed', async () => {
    const options = {
      integerA: BigNumber.from(100),
      addressA: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      integerB: BigNumber.from(200),
      addressB: '0x000000000000000000000000000000000000dEaD',
    }

    // Check if the initially deployed contract is valid
    const initialDeploy = await deployContract('Stub_ContractChild', options, hre)
    const initialContract = await hre.ethers.getContractAt<Stub_ContractChild>(initialDeploy.abi, initialDeploy.address)
    expect(await initialContract.integerA()).to.be.equal(options.integerA)
    expect(await initialContract.addressA()).to.be.equal(options.addressA)
    expect(await initialContract.integerB()).to.be.equal(options.integerB)
    expect(await initialContract.addressB()).to.be.equal(options.addressB)

    const newIntegerA = 333
    await initialContract.setIntegerA(newIntegerA)
    expect(await initialContract.integerA()).to.be.equal(newIntegerA)

    await replaceArtifacts('Stub_ContractChildWithInvalidParent', 'Stub_ContractChild')

    // Disable validation to be able intentionally deploy invalid implementation and break the contract
    process.env.SKIP_UPGRADE_VALIDATION = 'true'

    // Deploy invalid implementation and check that memory layout is broken
    const brokenDeploy = await deployContract('Stub_ContractChild', options, hre)
    const brokenContract = await hre.ethers.getContractAt<Stub_ContractChild>(brokenDeploy.abi, brokenDeploy.address)
    expect(await brokenContract.integerA()).to.not.be.equal(newIntegerA)
    expect(await brokenContract.addressA()).to.not.be.equal(options.addressA)

    await resetArtifacts()

    // Deploy the initially valid contract back and check that memory has been fixed
    const fixedDeploy = await deployContract('Stub_ContractChild', options, hre)
    const fixedContract = await hre.ethers.getContractAt<Stub_ContractChild>(fixedDeploy.abi, fixedDeploy.address)
    expect(await fixedContract.integerA()).to.be.equal(newIntegerA)
    expect(await fixedContract.addressA()).to.be.equal(options.addressA)
    expect(await fixedContract.integerB()).to.be.equal(options.integerB)
    expect(await fixedContract.addressB()).to.be.equal(options.addressB)

    // Just verifying that the upgrade has been done (not a new deploy)
    expect(initialDeploy.address).to.be.equal(brokenDeploy.address)
    expect(initialDeploy.address).to.be.equal(fixedDeploy.address)
  })
})
