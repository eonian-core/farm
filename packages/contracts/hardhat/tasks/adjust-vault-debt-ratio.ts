/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import readline from 'node:readline'
import { NetworkEnvironment, TokenSymbol, resolveNetworkEnvironment } from '@eonian/upgradeable'
import { task } from 'hardhat/config'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import _ from 'lodash'
import { Addresses } from '../deployment'

/**
 * Example: `
 * yarn hardhat adjust-vault-debt-ratio \
 *  --ratio 'ApeLendingStrategy:2000;AaveSupplyStrategy:8000' \
 *  --tokens 'USDT'
 *  --network localhost
 * `
 *
 * Will print:
 *
 * Current vault structure:
 * {
 *  "USDT": {
 *    "ApeLendingStrategy": 10000,
 *    "AaveSupplyStrategy": 0
 *  }
 * }
 * New vault structure:
 * {
 *  "USDT": {
 *    "ApeLendingStrategy": 2000,
 *    "AaveSupplyStrategy": 8000
 *  }
 * }
 * [USDT] ApeLendingStrategy: 10000 -> 2000
 * [USDT] AaveSupplyStrategy: 0 -> 8000
 * Updated vault structure:
 * {
 *  "USDT": {
 *    "ApeLendingStrategy": 2000,
 *    "AaveSupplyStrategy": 8000
 *  }
 * }
 */
task('adjust-vault-debt-ratio', 'Changes debt ratio for the vault strategies')
  .addOptionalParam('ratio', 'New debt ratio proportion', '')
  .addOptionalParam('tokens', 'Comma-separated token symbols of corresponding vaults', '')
  .setAction(async (taskArgs, hre) => {
    const ratio = parseRatio(taskArgs)
    const tokenSymbols = parseTokenSymbols(taskArgs)
    console.log('Ratio is:', ratio)
    console.log('Tokens (vaults) are:', tokenSymbols)

    const env = resolveNetworkEnvironment(hre)
    if (env === NetworkEnvironment.LOCAL) {
      const temp = console.log
      console.log('Running in local (testing) mode. Deploying contracts...')
      console.log = () => {}
      await hre.run('deploy')
      console.log = temp
    }

    const currentStructure = await getStructure(hre, tokenSymbols)
    printStructure(currentStructure, 'Current vault structure')

    if (Object.keys(ratio).length === 0) {
      console.warn('Param --ratio is not set, exiting...')
    }

    const newStructure = applyRatioToStructure(ratio, currentStructure)
    printStructure(newStructure, 'New vault structure')

    const continueIfStructureCorrect = await askQuestion('Continue? y/n')
    if (continueIfStructureCorrect !== 'y') {
      console.log('Aborted')
      return
    }

    const updatedStructure = await updateDebtRatio(newStructure, tokenSymbols, hre)
    printStructure(updatedStructure, 'Updated vault structure')
  })

async function updateDebtRatio(structure: Structure, tokenSymbols: TokenSymbol[], hre: HardhatRuntimeEnvironment): Promise<Structure> {
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]

  const balanceA = await hre.ethers.provider.getBalance(signer.address)
  console.log(`Balance before update: ${hre.ethers.formatEther(balanceA)}`)

  const vaultTokens = Object.keys(structure)
  for (const vaultToken of vaultTokens) {
    const vaultStructure = structure[vaultToken as TokenSymbol]!
    const strategies = _.sortBy(vaultStructure.strategies, strategy => strategy.debtRatio)
    for (const strategy of strategies) {
      const debtRatio = await currentDebtRatio(hre, vaultStructure.address, strategy.address)
      const newDebtRatio = strategy.debtRatio
      if (debtRatio === newDebtRatio) {
        console.log(`[${vaultToken}] ${strategy.name}: ${debtRatio} = ${newDebtRatio}, skip...`)
        continue
      }
      console.log(`[${vaultToken}] ${strategy.name}: ${debtRatio} -> ${newDebtRatio}`)
      await retry(async () => {
        const vault = await hre.ethers.getContractAt('Vault', vaultStructure.address, signer)
        await vault.setBorrowerDebtRatio(strategy.address, newDebtRatio)
      })
    }
  }

  const balanceB = await hre.ethers.provider.getBalance(signer.address)
  console.log(`Balance after update: ${hre.ethers.formatEther(balanceB)}`)

  return await getStructure(hre, tokenSymbols)
}

async function retry(block: () => Promise<void>, attempts = 10) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await block()
      break
    }
    catch (e) {
      if (i >= attempts) {
        throw e
      }
      else {
        console.log('Error occured, retrying...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
}

function askQuestion(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    rl.question(`${query}\nAnswer: `, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

function applyRatioToStructure(ratio: Record<string, number>, structure: Structure): Structure {
  const vaultStructures = Object.values(structure)
  for (const vaultStructure of vaultStructures) {
    let totalRatio = 0
    for (const strategy of vaultStructure.strategies) {
      const matchedRatio = ratio[strategy.name]
      if (matchedRatio === undefined) {
        continue
      }
      strategy.debtRatio = matchedRatio
      totalRatio += matchedRatio
    }
    if (totalRatio !== 10_000) {
      throw new Error('Total ratio is not 10_000!')
    }
  }
  return structure
}

function parseTokenSymbols(taskArgs: any): TokenSymbol[] {
  const value = String(taskArgs.tokens).trim()
  const availableTokenSymbols = Object.values(TokenSymbol)
  if (!value) {
    return availableTokenSymbols
  }
  const parsedTokenSymbols = value.split(',').map(symbol => symbol.trim()) as TokenSymbol[]
  for (const tokenSymbol of parsedTokenSymbols) {
    if (!availableTokenSymbols.includes(tokenSymbol)) {
      throw new Error(`Unknown token symbol: ${tokenSymbol}`)
    }
  }
  return parsedTokenSymbols
}

function parseRatio(taskArgs: any): Record<string, number> {
  const value = String(taskArgs.ratio).trim()
  if (!value) {
    return {}
  }
  const listOfNameToRatio = value.split(';')
  const result: Record<string, number> = {}

  let total = 0
  for (const nameToRatio of listOfNameToRatio) {
    const [name, ratio] = nameToRatio.split(':')
    result[name] = +ratio
    total += +ratio
  }
  if (total !== 10000) {
    throw new Error('Total ratio should be equal to 10_000')
  }
  return result
}

interface VaultStructure {
  address: string
  strategies: Array<{
    address: string
    debtRatio: number
    name: string
  }>
}

type Structure = Partial<Record<TokenSymbol, VaultStructure>>

async function getStructure(hre: HardhatRuntimeEnvironment, tokens: TokenSymbol[]): Promise<Structure> {
  const result: Structure = {}
  for (const tokenSymbol of tokens) {
    try {
      const vaultAddress = await hre.addresses.getForToken(Addresses.VAULT, tokenSymbol)
      const vault = await hre.ethers.getContractAt('Vault', vaultAddress)

      result[tokenSymbol] = {
        address: vaultAddress,
        strategies: [],
      }

      const strategies = result[tokenSymbol].strategies

      for (let i = 0; i < Number.POSITIVE_INFINITY; i++) {
        try {
          const strategyAddress = await vault.withdrawalQueue(i)
          const debtRatio = await currentDebtRatio(hre, vaultAddress, strategyAddress)
          const contractName = await resolveStrategyContractName(strategyAddress, hre)
          strategies.push({
            address: strategyAddress,
            name: contractName,
            debtRatio: Number(debtRatio),
          })
        }
        catch (e) {
          break
        }
      }
    }
    catch (e) {
      continue
    }
  }
  return result
}

async function currentDebtRatio(hre: HardhatRuntimeEnvironment, vaultAddress: string, strategyAddress: string): Promise<number> {
  const vault = await hre.ethers.getContractAt('Vault', vaultAddress)
  const debtRatio = await vault['currentDebtRatio(address)'](strategyAddress)
  return Number(debtRatio)
}

function simplifyStructure(structure: Structure) {
  return _.mapValues(structure, vault => simplifyStrategies(vault!.strategies))
}

function simplifyStrategies(strategies: Array<VaultStructure['strategies'][number]>) {
  return _.chain(strategies)
    .groupBy(strategy => strategy.name)
    .mapValues(strategy => strategy[0].debtRatio)
    .value()
}

function printStructure(structure: Structure, prefix?: string) {
  const simplified = simplifyStructure(structure)
  const stringified = JSON.stringify(simplified, null, 2)
  prefix ? console.log(`${prefix}:`, '\n', stringified) : console.log(stringified)
}

async function resolveStrategyContractName(address: string, hre: HardhatRuntimeEnvironment): Promise<string> {
  const proxyRecords = await hre.proxyRegister.getAll()
  for (const record of proxyRecords) {
    if (record.address === address) {
      return record.contractName
    }
  }
  throw new Error(`Cannot find strategy contract name (address: ${address})!`)
}
