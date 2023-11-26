import fs from 'node:fs'
import path from 'node:path'
import { TASK_DEPLOY } from 'hardhat-deploy'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

export const checkBalanceForDeploy = task(TASK_DEPLOY, async (_args, hre: HardhatRuntimeEnvironment, runSuper) => {
  if (hre.network.name === 'hardhat' && !process.env.TEST_DEPLOY) {
    return runSuper(_args)
  }
  const gasUsedTotal = await getEstimatedDeploymentGas(hre)
  const gasPrice = await hre.ethers.provider.getGasPrice()
  const estimatedDeploymentPrice = gasPrice.mul(gasUsedTotal).mul(120).div(100) // Multiply to extra 20% just for case
  const availableBalance = await getDeployerBalance(hre)

  const requiredBalance = hre.ethers.utils.formatEther(estimatedDeploymentPrice)
  const currentBalance = hre.ethers.utils.formatEther(availableBalance)
  console.log(`Deployer\'s account balance: ${currentBalance}, required: ${requiredBalance}.`)

  const hasEnoughBalanceToDeploy = availableBalance.gte(estimatedDeploymentPrice)
  if (!hasEnoughBalanceToDeploy) {
    throw new Error('There are insufficient funds in the deployer\'s account.')
  }
  return runSuper(_args)
})

async function getDeployerBalance(hre: HardhatRuntimeEnvironment) {
  const accounts = await hre.ethers.getSigners()
  if (accounts.length === 0) {
    throw new Error('No accounts data found. Check your env. vars!')
  }
  const balance = await accounts[0].getBalance()
  return balance
}

async function getEstimatedDeploymentGas(hre: HardhatRuntimeEnvironment) {
  const deployFunctions = await getDeployFunctions(hre)
  let gasUsedTotal = hre.ethers.BigNumber.from(0)
  for (const deployFunction of deployFunctions) {
    const gasUsed = await getGasUsedForDeployment(deployFunction, hre)
    gasUsedTotal = gasUsedTotal.add(gasUsed)
  }
  return gasUsedTotal
}

async function getGasUsedForDeployment(deployFunction: DeployFunction, hre: HardhatRuntimeEnvironment) {
  const [contractName] = deployFunction.tags ?? []
  if (!contractName) {
    throw new Error('Wrong deployment, no tags?')
  }

  const deploymentName = await getDeploymentName(contractName, hre)
  if (!deploymentName) {
    // If the contract has never been deployed, use the average gas price.
    return await getAverageGasPrice(hre)
  }

  const proxyDeployment = await hre.deployments.get(`${deploymentName}_Proxy`)
  const implementationDeployment = await hre.deployments.get(`${deploymentName}_Implementation`)

  const { receipt: proxyReceipt } = proxyDeployment
  const { receipt: implementationReceipt } = implementationDeployment

  if (!proxyReceipt || !implementationReceipt) {
    throw new Error(`No transaction information for "${contractName}"`)
  }

  let total = hre.ethers.BigNumber.from(0)
  total = total.add(proxyReceipt.gasUsed)
  total = total.add(implementationReceipt.gasUsed)
  return total
}

/**
 * Returns the average gas price for a single deployment.
 * Used to obtain an estimate of the value of a contract that has not yet been deployed.
 */
async function getAverageGasPrice(hre: HardhatRuntimeEnvironment) {
  const deployments = await hre.deployments.all()
  const deploymentNames = Object.keys(deployments)
  let total = hre.ethers.BigNumber.from(0)
  if (deploymentNames.length === 0) {
    return total
  }
  for (const name of deploymentNames) {
    const { receipt } = deployments[name]
    const gasUsed = receipt?.gasUsed ?? 0
    total = total.add(gasUsed)
  }
  return total.div(deploymentNames.length).mul(2)
}

async function getDeploymentName(contractName: string, hre: HardhatRuntimeEnvironment) {
  const deployments = await hre.deployments.all()
  const deploymentNames = Object.keys(deployments)

  for (const name of deploymentNames) {
    const hasSuffix = name.endsWith('_Implementation') || name.endsWith('_Proxy')
    if (hasSuffix) {
      continue
    }

    const isContractRelated = name.split('|').at(0) === contractName
    if (isContractRelated) {
      return name
    }
  }
}

async function getDeployFunctions(hre: HardhatRuntimeEnvironment) {
  const result: DeployFunction[] = []

  const deployDir = hre.config.paths.deploy[0]
  const files = await fs.promises.readdir(deployDir)
  for (const file of files) {
    const modulePath = path.resolve(deployDir, file)
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const deployFunction = require(modulePath) as { default: DeployFunction }
    const skip = await deployFunction.default.skip!(hre)
    if (skip) {
      continue
    }
    result.push(deployFunction.default)
  }
  return result
}
