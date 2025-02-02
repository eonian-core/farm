import hre from 'hardhat'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { type DeployResult, DeployStatus, TokenSymbol } from '@eonian/upgradeable'
import type { ContractName } from 'hardhat/types'
import { deleteErrorFile } from '../../../hardhat/tasks/deploy-error-catcher'
import { clearDeployments } from '../../deploy/helpers'
import { getStrategyDeploymentPlan } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'
import type { Strategy, StrategyDeploymentPlan } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'

describe('BSC Deploy Task', () => {
  clearDeployments(hre)

  let tempLog: () => void

  async function setup() { }

  beforeEach(async () => {
    tempLog = console.log
    console.log = () => { }
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

    const deployTaskArgs = {
      plan: JSON.stringify({
        APESWAP: [TokenSymbol.USDC],
      } satisfies StrategyDeploymentPlan),
    }

    await hre.run('deploy', deployTaskArgs)

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

    const deployTaskArgs = {
      plan: JSON.stringify({
        APESWAP: [TokenSymbol.USDC],
      } satisfies StrategyDeploymentPlan),
    }

    // First deploy. Only the first proxy should be deployed.
    await hre.run('deploy', deployTaskArgs)
    const [firstDeployedProxy, ...restProxies] = getDeployments(TokenSymbol.USDC)
    expect(firstDeployedProxy.status).to.be.equal(DeployStatus.DEPLOYED)
    expect(restProxies.length).to.be.equal(0)

    hre.onBeforeDeploy = undefined

    // Second deploy. The first proxy should be skipped, but the rest ones are deployed.
    await setDeployerBalance(100n * 10n ** 18n)
    await hre.run('deploy', deployTaskArgs)
    const [firstProxy, ...restDeployedProxies] = getDeployments(TokenSymbol.USDC)
    expect(firstProxy.status).to.be.equal(DeployStatus.NONE)
    expect(restDeployedProxies.every(deployment => deployment.status === DeployStatus.DEPLOYED)).to.be.equal(true)

    // No errors should be thrown.
    await expect(hre.run('check-deploy-error')).not.to.be.rejectedWith(Error)
  })

  it('Should deploy every strategy from deployment-plan', async () => {
    process.env.CI = 'true'

    await setDeployerBalance(100n * 10n ** 18n)
    await hre.run('deploy')

    const plan = getStrategyDeploymentPlan(hre)
    const strategyToContractNameLookup: Partial<Record<Strategy, ContractName>> = {
      AAVE_V3: 'AaveSupplyStrategy',
      APESWAP: 'ApeLendingStrategy',
    }

    const vaultAddresses = new Set()

    const strategies = Object.keys(plan) as Strategy[]
    for (const strategy of strategies) {
      const contractName = strategyToContractNameLookup[strategy]!
      const tokens = plan[strategy]!
      for (const token of tokens) {
        const deployment = getDeployment(contractName, token)
        const strategyContract = await hre.ethers.getContractAt('BaseStrategy', deployment.proxyAddress)

        const vaultAddress = await strategyContract.lender()
        const vaultDeployment = getDeployment('Vault', token)
        expect(vaultAddress, 'Different vault').to.be.eq(vaultDeployment.proxyAddress)

        const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
        const strategyData = await vault.borrowersData(deployment.proxyAddress)

        expect(strategyData.activationTimestamp, 'Strategy is not active!').to.be.greaterThan(0)

        vaultAddresses.add(vaultAddress)
      }
    }

    expect(vaultAddresses.size).to.be.eq(4)
  })
})

function getDeployments(token: TokenSymbol): DeployResult[] {
  const deployments = Object.values(hre.lastDeployments)
  return deployments.filter(deployment => deployment.deploymentId === token || !deployment.deploymentId)
}

function getDeployment(contractName: ContractName, token: TokenSymbol): DeployResult {
  const deployments = Object.values(hre.lastDeployments)
  const deployment = deployments.find(deployment => deployment.deploymentId === token && deployment.contractName === contractName)
  expect(deployment, `Missing deployment for ${contractName} (${token})`).not.to.be.eq(undefined)
  return deployment!
}

async function setDeployerBalance(balance: bigint) {
  const [deployer] = await hre.ethers.getSigners()
  await helpers.setBalance(deployer.address, balance)
}
