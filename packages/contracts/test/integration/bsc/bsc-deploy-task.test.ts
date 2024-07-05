import hre from 'hardhat'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { deleteErrorFile } from '../../../hardhat/tasks/deploy-error-catcher'
import { type DeployResult, DeployStatus, TokenSymbol } from '@eonian/upgradeable'
import { clearDeployments } from '../../deploy/helpers'

describe('BSC Deploy Task', () => {
  clearDeployments(hre)

  let tempLog: () => void

  async function setup() {}

  beforeEach(async () => {
    tempLog = console.log
    console.log = () => {}
    await helpers.loadFixture(setup)
  })

  afterEach(async () => {
    process.env.CI = 'false'

    await deleteErrorFile()

    hre.lastDeployments = {}
    hre.onBeforeDeploy = undefined

    console.log = tempLog
  })

  it('Should write deploy error to file', async () => {
    process.env.CI = 'true'

    // Set deployer's balance to 0 before "Vault" deployment.
    hre.onBeforeDeploy = async (contractName) => {
      if (contractName === 'Vault') {
        const [deployer] = await hre.ethers.getSigners()
        await helpers.setBalance(deployer.address, 0)
      }
    }

    await hre.run('deploy', { tokens: [TokenSymbol.USDC].join() })

    await expect(hre.run('check-deploy-error')).to.be.rejectedWith(Error, 'sender doesn\'t have enough funds to send tx')
  })

  it('Should continue after first failed deploy attempt', async () => {
    process.env.CI = 'true'

    // Set deployer's balance to 0 before "Vault" deployment.
    hre.onBeforeDeploy = async (contractName) => {
      if (contractName === 'Vault') {
        await setDeployerBalance(0n)
      }
    }

    // First deploy. Only the first proxy should be deployed.
    await hre.run('deploy', { tokens: [TokenSymbol.USDC].join() })
    const [firstDeployedProxy, ...restProxies] = getDeployments(TokenSymbol.USDC)
    expect(firstDeployedProxy.status).to.be.equal(DeployStatus.DEPLOYED)
    expect(restProxies.length).to.be.equal(0)

    hre.onBeforeDeploy = undefined

    // Second deploy. The first proxy should be skipped, but the rest ones are deployed.
    await setDeployerBalance(100n * 10n ** 18n)
    await hre.run('deploy', { tokens: [TokenSymbol.USDC].join() })
    const [firstProxy, ...restDeployedProxies] = getDeployments(TokenSymbol.USDC)
    expect(firstProxy.status).to.be.equal(DeployStatus.NONE)
    expect(restDeployedProxies.every(deployment => deployment.status === DeployStatus.DEPLOYED)).to.be.equal(true)

    // No errors should be thrown.
    await expect(hre.run('check-deploy-error')).not.to.be.rejectedWith(Error)
  })
})

function getDeployments(token: TokenSymbol): DeployResult[] {
  const deployments = Object.values(hre.lastDeployments)
  return deployments.filter(deployment => deployment.deploymentId === token || !deployment.deploymentId)
}

async function setDeployerBalance(balance: bigint) {
  const [deployer] = await hre.ethers.getSigners()
  await helpers.setBalance(deployer.address, balance)
}
