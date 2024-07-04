import hre from 'hardhat'
import { ethers } from 'ethers'
import { expectImplementationMatch } from './asserts'
import { clearDeployments, deployContract, getDeploymentEvents, manageArtifacts } from '../test-helpers'
import { DeployStatus } from '../plugins'

describe('Upgrade', () => {
  const { replaceArtifacts } = manageArtifacts(hre, {beforeEach, afterEach})

  clearDeployments(hre, {beforeEach, afterEach})

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

    expect(deployResult.status).toEqual(DeployStatus.DEPLOYED)
    expect(upgradeResult.status).toEqual(DeployStatus.UPGRADED)

    expect(upgradeResult.proxyAddress).toEqual(deployResult.proxyAddress)
    expect(upgradeResult.implementationAddress).not.toEqual(deployResult.implementationAddress)

    const upgradedEvents = await getDeploymentEvents(upgradeResult.proxyAddress, 'Upgraded', hre) as ethers.EventLog[]
    expect(upgradedEvents.length).toEqual(2)
    expect(upgradedEvents[0].args?.[0]).toEqual(deployResult.implementationAddress)
    expect(upgradedEvents[1].args?.[0]).toEqual(upgradeResult.implementationAddress)
  })

  it('Should deploy and upgrade proxy', async () => {
    const contractName = 'Stub_Contract'

    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])
    const deployResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(deployResult.status).toEqual(DeployStatus.DEPLOYED)

    const contractBeforeUpgrade = await hre.ethers.getContractAt(contractName, deployResult.proxyAddress)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).toEqual(options.get('integerA'))
    expect(await contractBeforeUpgrade.addressA()).toEqual(options.get('addressA'))

    // Set values to new ones
    const newIntegerA = 333
    const newAddressA = '0x000000000000000000000000000000000000dEaD'
    await contractBeforeUpgrade.setIntegerA(newIntegerA)
    await contractBeforeUpgrade.setAddressA(newAddressA)
    expect(await contractBeforeUpgrade.integerA()).toEqual(newIntegerA)
    expect(await contractBeforeUpgrade.addressA()).toEqual(newAddressA)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')

    const upgradeResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(upgradeResult.status).toEqual(DeployStatus.UPGRADED)

    const contractAfterUpgrade = await hre.ethers.getContractAt('Stub_ContractSimpleUpgrade', upgradeResult.proxyAddress)

    const newIntegerB = 500
    await contractAfterUpgrade.setIntegerB(newIntegerB)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).toEqual(newIntegerA)
    expect(await contractAfterUpgrade.addressA()).toEqual(newAddressA)
    expect(await contractAfterUpgrade.integerB()).toEqual(newIntegerB)
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
    expect(deployResult.status).toEqual(DeployStatus.DEPLOYED)

    const contractBeforeUpgrade = await hre.ethers.getContractAt(contractName, deployResult.proxyAddress)

    // Contract variables should have initial (initialized) values
    expect(await contractBeforeUpgrade.integerA()).toEqual(options.get('integerA'))
    expect(await contractBeforeUpgrade.addressA()).toEqual(options.get('addressA'))
    expect(await contractBeforeUpgrade.integerB()).toEqual(options.get('integerB'))
    expect(await contractBeforeUpgrade.addressB()).toEqual(options.get('addressB'))

    await replaceArtifacts('Stub_ContractChildSimpleUpgrade', 'Stub_ContractChild')

    const upgradeResult = await deployContract(contractName, Array.from(options.values()), hre)
    expect(upgradeResult.status).toEqual(DeployStatus.UPGRADED)

    const contractAfterUpgrade = await hre.ethers.getContractAt('Stub_ContractChildSimpleUpgrade', upgradeResult.proxyAddress)

    const newIntegerC = 500
    await contractAfterUpgrade.setIntegerC(newIntegerC)

    // Ensure contract still has correct values (along with the new "integerB" variable)
    expect(await contractAfterUpgrade.integerA()).toEqual(options.get('integerA'))
    expect(await contractAfterUpgrade.addressA()).toEqual(options.get('addressA'))
    expect(await contractAfterUpgrade.integerB()).toEqual(options.get('integerB'))
    expect(await contractAfterUpgrade.addressB()).toEqual(options.get('addressB'))
    expect(await contractAfterUpgrade.integerC()).toEqual(newIntegerC)
  })

  it('Should validate storage layout before upgrade', async () => {
    const options = new Map<string, any>([
      ['integerA', ethers.toBigInt(100)],
      ['addressA', '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'],
    ])

    await deployContract('Stub_Contract', Array.from(options.values()), hre)

    await replaceArtifacts('Stub_ContractInvalidUpgrade', 'Stub_Contract')

    await expect(deployContract('Stub_Contract', Array.from(options.values()), hre))
      .rejects.toEqual(/.*New storage layout is incompatible.*/)
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
      .rejects.toEqual(/.*New storage layout is incompatible.*/)
  })
})
