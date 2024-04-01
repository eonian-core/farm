import hre from 'hardhat'
import { expect } from 'chai'
import { ethers } from 'ethers'
import { DeployStatus } from '../../hardhat/deployment/plugins/Deployer'
import { expectImplementationMatch } from './asserts'
import { clearDeployments, deployContract, getDeploymentEvents, manageArtifacts } from './helpers'

describe('Upgrade', () => {
  const { replaceArtifacts } = manageArtifacts(hre)

  clearDeployments(hre)

  it('Should deploy and upgrade proxy (check upgrade events)', async () => {
    const contractName = 'Stub_Contract'

    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])
    const deployResult = await deployContract(contractName, Array.from(options.values()), hre)
    const contract = await hre.ethers.getContractAt(contractName, deployResult.proxyAddress)
    await expectImplementationMatch(await contract.getAddress(), deployResult.implementationAddress, hre)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract(contractName, Array.from(options.values()), hre)
    await expectImplementationMatch(upgradeResult.proxyAddress, upgradeResult.implementationAddress, hre)

    expect(deployResult.status).to.be.equal(DeployStatus.DEPLOYED)
    expect(upgradeResult.status).to.be.equal(DeployStatus.UPGRADED)

    expect(upgradeResult.proxyAddress).to.be.equal(deployResult.proxyAddress)
    expect(upgradeResult.implementationAddress).not.to.be.equal(deployResult.implementationAddress)

    const upgradedEvents = await getDeploymentEvents(upgradeResult.proxyAddress, 'Upgraded', hre) as ethers.EventLog[]
    expect(upgradedEvents.length).to.be.equal(2)
    expect(upgradedEvents[0].args?.[0]).to.be.equal(deployResult.implementationAddress)
    expect(upgradedEvents[1].args?.[0]).to.be.equal(upgradeResult.implementationAddress)
  })

  it('Should deploy and upgrade proxy', async () => {
    const contractName = 'Stub_Contract'

    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])
    const deployResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(deployResult.status).to.be.equal(DeployStatus.DEPLOYED)

    const contractBeforeUpgrade = await hre.ethers.getContractAt(contractName, deployResult.proxyAddress)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(options.get('integerA'))
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(options.get('addressA'))

    // Set values to new ones
    const newIntegerA = 333
    const newAddressA = '0x000000000000000000000000000000000000dEaD'
    await contractBeforeUpgrade.setIntegerA(newIntegerA)
    await contractBeforeUpgrade.setAddressA(newAddressA)
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(newIntegerA)
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(newAddressA)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(upgradeResult.status).to.be.equal(DeployStatus.UPGRADED)

    const contractAfterUpgrade = await hre.ethers.getContractAt('Stub_ContractSimpleUpgrade', upgradeResult.proxyAddress)

    const newIntegerB = 500
    await contractAfterUpgrade.setIntegerB(newIntegerB)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).to.be.equal(newIntegerA)
    expect(await contractAfterUpgrade.addressA()).to.be.equal(newAddressA)
    expect(await contractAfterUpgrade.integerB()).to.be.equal(newIntegerB)
  })

  it('Should deploy and upgrade proxy (with inheritance)', async () => {
    const contractName = 'Stub_ContractChild'
    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
      ['integerB', ethers.toBigInt(200)],
      ['addressB', '0x000000000000000000000000000000000000dEaD'],
    ])

    const deployResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(deployResult.status).to.be.equal(DeployStatus.DEPLOYED)

    const contractBeforeUpgrade = await hre.ethers.getContractAt(contractName, deployResult.proxyAddress)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).to.be.equal(options.get('integerA'))
    expect(await contractBeforeUpgrade.addressA()).to.be.equal(options.get('addressA'))
    expect(await contractBeforeUpgrade.integerB()).to.be.equal(options.get('integerB'))
    expect(await contractBeforeUpgrade.addressB()).to.be.equal(options.get('addressB'))

    await replaceArtifacts('Stub_ContractChildSimpleUpgrade', 'Stub_ContractChild')

    const upgradeResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(upgradeResult.status).to.be.equal(DeployStatus.UPGRADED)

    const contractAfterUpgrade = await hre.ethers.getContractAt('Stub_ContractChildSimpleUpgrade', upgradeResult.proxyAddress)

    const newIntegerC = 500
    await contractAfterUpgrade.setIntegerC(newIntegerC)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).to.be.equal(options.get('integerA'))
    expect(await contractAfterUpgrade.addressA()).to.be.equal(options.get('addressA'))
    expect(await contractAfterUpgrade.integerB()).to.be.equal(options.get('integerB'))
    expect(await contractAfterUpgrade.addressB()).to.be.equal(options.get('addressB'))
    expect(await contractAfterUpgrade.integerC()).to.be.equal(newIntegerC)
  })

  it('Should validate storage layout before upgrade', async () => {
    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])

    await deployContract('Stub_Contract', Array.from(options.values()), hre)

    await replaceArtifacts('Stub_ContractInvalidUpgrade', 'Stub_Contract')

    await expect(deployContract('Stub_Contract', Array.from(options.values()), hre))
      .to.be.rejectedWith(/.*New storage layout is incompatible.*/)
  })

  it('Should validate storage layout before upgrade (with inheritance)', async () => {
    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
      ['integerB', ethers.toBigInt(200)],
      ['addressB', '0x000000000000000000000000000000000000dEaD'],
    ])

    await deployContract('Stub_ContractChild', Array.from(options.values()), hre)

    await replaceArtifacts('Stub_ContractChildWithInvalidParent', 'Stub_ContractChild')

    await expect(deployContract('Stub_ContractChild', Array.from(options.values()), hre))
      .to.be.rejectedWith(/.*New storage layout is incompatible.*/)
  })
})
