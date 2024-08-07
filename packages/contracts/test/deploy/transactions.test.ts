import hre, { ethers } from 'hardhat'
import { expect } from 'chai'
import { uniq } from 'lodash'
import { clearDeployments, deployContract, manageArtifacts } from './helpers'

interface TransactionInfo { hash: string; from: string; to: string | null; isDeployment: boolean; deployedAddress: string | null }

describe('Transactions', () => {
  const { replaceArtifacts } = manageArtifacts(hre)

  clearDeployments(hre)

  const args = [ethers.toBigInt(100), '0xB8c77482e45F1F44dE1745F52C74426C631bDD52']

  beforeEach(async () => {
    await hre.network.provider.send('hardhat_reset')
  })

  it('Should send 2 deploy transactions for fresh contract', async () => {
    const contractName = 'Stub_Contract'
    const { proxyAddress, implementationAddress } = await deployContract(contractName, args, hre)

    const transactions = await getAllTransactions()
    expect(transactions.length).to.be.equal(2)

    // Deploy proxy
    expect(transactions[0].isDeployment).to.be.equal(true)
    expect(transactions[0].deployedAddress).to.be.equal(implementationAddress)

    // Deploy implementation
    expect(transactions[1].isDeployment).to.be.equal(true)
    expect(transactions[1].deployedAddress).to.be.equal(proxyAddress)
  })

  it('Should send 4 transactions for deploy & upgrade', async () => {
    const contractName = 'Stub_Contract'

    const { implementationAddress: implementationA } = await deployContract(contractName, args, hre)
    await replaceArtifacts('Stub_ContractSimpleUpgrade', 'Stub_Contract')
    const { proxyAddress, implementationAddress: implementationB } = await deployContract(contractName, args, hre)

    const transactions = await getAllTransactions()
    expect(transactions.length).to.be.equal(4)

    // Deploy proxy
    expect(transactions[0].isDeployment).to.be.equal(true)
    expect(transactions[0].deployedAddress).to.be.equal(implementationA)

    // Deploy #1 implementation
    expect(transactions[1].isDeployment).to.be.equal(true)
    expect(transactions[1].deployedAddress).to.be.equal(proxyAddress)

    // Deploy #2 implementation
    expect(transactions[2].isDeployment).to.be.equal(true)
    expect(transactions[2].deployedAddress).to.be.equal(implementationB)

    // Set proxy implementation address to implementation #2
    expect(transactions[3].isDeployment).to.be.equal(false)
    expect(transactions[3].to).to.be.equal(proxyAddress)
  })

  it('Should not set implementation if contract is already deployed', async () => {
    const contractName = 'Stub_Contract'

    for (let i = 0; i < 5; i++) {
      await deployContract(contractName, args, hre)
    }

    const transactions = await getAllTransactions()
    expect(transactions.length).to.be.equal(2)

    // Deploy proxy
    expect(transactions[0].isDeployment).to.be.equal(true)

    // Deploy implementation
    expect(transactions[1].isDeployment).to.be.equal(true)
  })

  it('Should not set implementation if contract is already upgraded', async () => {
    const contractName = 'Stub_Contract'

    await deployContract(contractName, args, hre)

    await replaceArtifacts('Stub_ContractSimpleUpgrade', contractName)

    for (let i = 0; i < 5; i++) {
      await deployContract(contractName, args, hre)
    }

    const transactions = await getAllTransactions()
    expect(transactions.length).to.be.equal(4)

    // Deploy proxy
    expect(transactions[0].isDeployment).to.be.equal(true)

    // Deploy #1 implementation
    expect(transactions[1].isDeployment).to.be.equal(true)

    // Deploy #2 implementation
    expect(transactions[2].isDeployment).to.be.equal(true)

    // Set proxy implementation address to implementation #2
    expect(transactions[3].isDeployment).to.be.equal(false)
  })

  it('Should reuse existing implementation for multiple proxies', async () => {
    const contractName = 'Stub_Contract'

    // Deploy 5 different proxies
    await deployContract(contractName, args, hre, 'A')
    await deployContract(contractName, args, hre, 'B')
    await deployContract(contractName, args, hre, 'C')
    await deployContract(contractName, args, hre, 'D')
    await deployContract(contractName, args, hre, 'E')

    // Check that we have 5 different proxies
    const proxyRecords = await hre.proxyRegister.getAll()
    const proxyIds = proxyRecords.map(record => record.id)
    expect(proxyIds).to.be.deep.equal(['A', 'B', 'C', 'D', 'E'])

    // All implementation address are the same
    const implementationAddresses = uniq(proxyRecords.map(record => record.implementationAddress))
    expect(implementationAddresses.length).to.be.equal(1)

    const implementationAddress = implementationAddresses[0]

    // Check that 6 txs were sent (5 proxy deploymentss & 1 impl.)
    const transactions = await getAllTransactions()
    expect(transactions.length).to.be.equal(6)

    // First transaction is implementation deployment
    expect(transactions[0].deployedAddress).to.be.equal(implementationAddress)

    const expectDeployedProxyAddress = async (addressFromTX: string, proxyId: string) => {
      expect(addressFromTX).to.be.equal(await hre.proxyRegister.getProxyAddress(contractName, proxyId))
    }
    await expectDeployedProxyAddress(transactions[1].deployedAddress!, 'A')
    await expectDeployedProxyAddress(transactions[2].deployedAddress!, 'B')
    await expectDeployedProxyAddress(transactions[3].deployedAddress!, 'C')
    await expectDeployedProxyAddress(transactions[4].deployedAddress!, 'D')
    await expectDeployedProxyAddress(transactions[5].deployedAddress!, 'E')
  })

  it('Should reuse implementation after upgrade', async () => {
    const contractName = 'Stub_Contract'

    // Deploy 3 different proxies
    await deployContract(contractName, args, hre, 'A')
    await deployContract(contractName, args, hre, 'B')
    await deployContract(contractName, args, hre, 'C')

    await replaceArtifacts('Stub_ContractSimpleUpgrade', contractName)

    // Upgrade first deployed proxy
    await deployContract(contractName, args, hre, 'A')

    const blockNumber = await hre.ethers.provider.getBlockNumber()

    // Upgrade 2 other proxies
    const { proxyAddress: proxyB } = await deployContract(contractName, args, hre, 'B')
    const { proxyAddress: proxyC } = await deployContract(contractName, args, hre, 'C')

    // Check that only 2 transaction were made to upgrade proxies "B" and "C" (only "set impl" calls)
    const transactions = await getAllTransactions(blockNumber + 1)
    expect(transactions.length).to.be.equal(2)
    expect(transactions.every(tx => !tx.isDeployment)).to.be.equal(true)
    expect(transactions[0].to).to.be.equal(proxyB)
    expect(transactions[1].to).to.be.equal(proxyC)
  })
})

async function getAllTransactions(startBlockNumber = 0): Promise<TransactionInfo[]> {
  const blockNumber = await hre.ethers.provider.getBlockNumber()
  const transactions: TransactionInfo[] = []
  for (let i = startBlockNumber; i < blockNumber + 1; i++) {
    const blockTransactions = await getTransactions(i)
    transactions.push(...blockTransactions)
  }
  return transactions
}

async function getTransactions(blockNumber: number): Promise<TransactionInfo[]> {
  const block = await hre.ethers.provider.getBlock(blockNumber, true)
  if (!block) {
    throw new Error(`Block #${blockNumber} is not found`)
  }

  const transactions: TransactionInfo[] = []
  for (const tx of block.prefetchedTransactions) {
    const createdAddress = hre.ethers.getCreateAddress({ from: tx.from, nonce: tx.nonce })
    const isDeployment = tx.to === null
    transactions.push({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      deployedAddress: isDeployment ? createdAddress : null,
      isDeployment,

    })
  }
  return transactions
}