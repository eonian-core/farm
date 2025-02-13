import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { TokenSymbol } from '@eonian/upgradeable'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { clearDeployments } from '../../deploy/helpers'
import { deployTaskAction } from '../../../hardhat/tasks'
import { Addresses } from '../../../hardhat/deployment'
import type { AaveSupplyStrategy, IERC20, Vault } from '../../../typechain-types'
import { getContractAt } from '../helpers/get-contract-at'
import { getAddress } from '../helpers/get-address'
import resetBalance from '../helpers/reset-balance'
import { depositToVault, withdrawFromVault } from '../helpers/vault-deposit-withdraw'
import warp from '../helpers/warp'
import { Strategy } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'

describe('Aave Supply Strategy V2', () => suite(Strategy.AAVE_V2))
describe('Aave Supply Strategy V3', () => suite(Strategy.AAVE_V3))

function suite(aaveStrategy: Strategy.AAVE_V3 | Strategy.AAVE_V2) {
  clearDeployments(hre)

  const { ethers } = hre

  const token = TokenSymbol.USDC
  const minReportInterval = 3600

  let holderA: HardhatEthersSigner
  let holderB: HardhatEthersSigner

  let vault: Vault
  let strategy: AaveSupplyStrategy
  let assetToken: IERC20

  let vaultAddress: string
  let strategyAddress: string
  let aTokenAddress: string
  let rewardsAddress: string

  async function setup() {
    process.env.TEST_STRATEGY_MIN_REPORT_INTERVAL = String(minReportInterval)

    await deployTaskAction(hre, { [aaveStrategy]: [token] })

    vault = await getContractAt<Vault>('Vault', token)
    vaultAddress = await vault.getAddress()

    holderA = await ethers.getSigner('0xf89d7b9c864f589bbF53a82105107622B35EaA40') // Bybit wallet
    await helpers.impersonateAccount(holderA.address)

    holderB = await ethers.getSigner('0x28C6c06298d514Db089934071355E5743bf21d60') // Binance Hot Wallet #14
    await helpers.impersonateAccount(holderB.address)

    const gelatoAddress = await getAddress(Addresses.GELATO)
    await helpers.impersonateAccount(gelatoAddress)

    strategy = await getContractAt<AaveSupplyStrategy>('AaveSupplyStrategy', token)
    strategyAddress = await strategy.getAddress()

    const assetAddress = await getAddress(Addresses.TOKEN, token)
    assetToken = await hre.ethers.getContractAt('IERC20', assetAddress)

    aTokenAddress = await strategy.aToken()
    rewardsAddress = await vault.rewards()

    await resetBalance(vaultAddress, { tokens: [await vault.asset()] })
    await resetBalance(strategyAddress, { tokens: [aTokenAddress] })
  }

  beforeEach(async () => {
    await helpers.loadFixture(setup)
  })

  it('Should deposit and withdraw from the vault after investing to the strategy', async () => {
    // Vault is empty, no USDC amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holder has some amount of USDC (e.g., >30000)
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(30000n * 10n ** 6n)

    // Approve and deposit 3000 USDC in the vault on behalf of the holder
    const depositAmount = 3000n * 10n ** 6n
    await depositToVault(holderA, depositAmount, vault)

    // Transfer deposited amount of USDC from the vault to the strategy
    // Track is: Vault -> Strategy -> aToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, aTokenAddress],
      [-depositAmount, 0, depositAmount],
    )

    // Withdraw 1500 USDC from the vault
    const withdrawalAmount = 1500n * 10n ** 6n
    await withdrawFromVault(holderA, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, aTokenAddress, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  it('Should deposit and withdraw from the vault after investing to the strategy (multiple users)', async () => {
    // Vault is empty, no USDC amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of USDC (e.g., >3000)
    const min = 3000n * 10n ** 6n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)
    expect(await assetToken.balanceOf(holderB.address)).to.be.greaterThan(min)

    // Approve and deposit 300 USDC in the vault on behalf of the holders
    const depositAmount = 300n * 10n ** 6n
    await depositToVault(holderA, depositAmount, vault)
    await depositToVault(holderB, depositAmount, vault)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n)

    // Transfer deposited amount of USDC from the vault to the strategy
    // Track is: Vault -> Strategy -> aToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, aTokenAddress],
      [-depositAmount * 2n, 0, depositAmount * 2n],
    )

    // Withdraw 15 USDC from the vault
    const withdrawalAmount = 150n * 10n ** 6n
    await withdrawFromVault(holderA, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, aTokenAddress, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
    await withdrawFromVault(holderB, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, aTokenAddress, holderB.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  it('Should increase aToken balance over time', async () => {
    const depositAmount = 300n * 10n ** 6n
    await depositToVault(holderA, depositAmount, vault)

    // Put some funds to the strategy
    await strategy.work()

    const balanceBefore = await strategy.estimatedTotalAssets()

    // Wait 6h to accumulate the interest
    await warp(6 * minReportInterval)

    const balanceAfter = await strategy.estimatedTotalAssets()

    expect(balanceAfter).to.be.greaterThan(balanceBefore)
  })

  it('Should accumulate rewards', async () => {
    const workGas = await strategy.estimatedWorkGas()

    // Set est. work gas to 0 to prevent "work()" call from failing
    await strategy.setEstimatedWorkGas(0n)

    // Vault is empty, no USDC amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Rewards address should be empty on start
    expect(await vault.balanceOf(rewardsAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of USDC (e.g., >15000)
    const min = 15000n * 5n * 10n ** 6n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)

    // Make N deposits and reports
    for (let i = 0; i < 5; i++) {
      const depositAmount = 3000n * 10n ** 6n
      await depositToVault(holderA, depositAmount, vault)

      await strategy.work()
      await warp(minReportInterval + 60) // Interval + 1 minute
    }

    // Wait 6h to accumulate the interest
    await warp(6 * minReportInterval)
    await strategy.work()

    // Treasury is an owner by default
    const [owner] = await ethers.getSigners()
    expect(rewardsAddress).to.be.equal(owner.address)

    // Rewards address should have some vault shares
    expect(await vault.balanceOf(rewardsAddress)).to.be.greaterThan(1)

    // Return est. work gas value back
    await strategy.setEstimatedWorkGas(workGas)
  })
}
