import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ZeroAddress } from 'ethers'
import { TokenSymbol } from '@eonian/upgradeable'
import type {
  ApeLendingStrategy,
  IERC20,
  Vault,
} from '../../../typechain-types'

import { deployTaskAction } from '../../../hardhat/tasks'
import { Addresses } from '../../../hardhat/deployment/addresses'
import warp from '../helpers/warp'
import resetBalance from '../helpers/reset-balance'
import { clearDeployments } from '../../deploy/helpers'
import { getContractAt } from '../helpers/get-contract-at'
import { getAddress } from '../helpers/get-address'
import { depositToVault, withdrawFromVault } from '../helpers/vault-deposit-withdraw'
import { Strategy } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'

describe('Ape Lending Strategy', () => {
  clearDeployments(hre)

  const { ethers } = hre

  const token = TokenSymbol.USDT
  const minReportInterval = 3600

  let holderA: HardhatEthersSigner
  let holderB: HardhatEthersSigner

  let vault: Vault
  let strategy: ApeLendingStrategy
  let assetToken: IERC20

  let vaultAddress: string
  let strategyAddress: string
  let cTokenAddress: string
  let rewardsAddress: string

  async function setup() {
    process.env.TEST_STRATEGY_MIN_REPORT_INTERVAL = String(minReportInterval)

    await deployTaskAction(hre, { [Strategy.APESWAP]: [token] })

    vault = await getContractAt<Vault>('Vault', token)
    vaultAddress = await vault.getAddress()
    // hre.tracer.nameTags[vaultAddress] = 'Vault'

    holderA = await ethers.getSigner('0x8894e0a0c962cb723c1976a4421c95949be2d4e3') // Binance Hot Wallet #6
    await helpers.impersonateAccount(holderA.address)
    // hre.tracer.nameTags[holderA.address] = 'Holder A'

    holderB = await ethers.getSigner('0xF977814e90dA44bFA03b6295A0616a897441aceC') // Binance Hot Wallet #20
    await helpers.impersonateAccount(holderB.address)
    // hre.tracer.nameTags[holderB.address] = 'Holder B'

    const gelatoAddress = await getAddress(Addresses.GELATO)
    await helpers.impersonateAccount(gelatoAddress)
    // hre.tracer.nameTags[gelatoAddress] = 'Gelato Ops'

    strategy = await getContractAt<ApeLendingStrategy>('ApeLendingStrategy', token)
    strategyAddress = await strategy.getAddress()
    // hre.tracer.nameTags[strategyAddress] = 'Strategy'

    const assetAddress = await getAddress(Addresses.TOKEN, token)
    assetToken = await hre.ethers.getContractAt('IERC20', assetAddress)
    // hre.tracer.nameTags[assetAddress] = 'BUSD'

    cTokenAddress = await strategy.cToken()
    // hre.tracer.nameTags[cTokenAddress] = 'cToken'

    rewardsAddress = await vault.rewards()
    // hre.tracer.nameTags[rewardsAddress] = 'Rewards'

    await resetBalance(vaultAddress, { tokens: [await vault.asset()] })
    await resetBalance(strategyAddress, { tokens: [cTokenAddress] })
  }

  beforeEach(async () => {
    await helpers.loadFixture(setup)
  })

  it('Should deposit and withdraw from the vault', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holder has some amount of BUSD (e.g., >300)
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(300n * 10n ** 18n)

    // Approve and deposit 30 BUSD in the vault on behalf of the holder
    const depositAmount = 30n * 10n ** 18n
    await depositToVault(holderA, depositAmount, vault)

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdrawFromVault(holderA, withdrawalAmount, vault)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount - withdrawalAmount)
  })

  it('Should deposit and withdraw from the vault (multiple users)', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of BUSD (e.g., >300)
    const min = 300n * 10n ** 18n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)
    expect(await assetToken.balanceOf(holderB.address)).to.be.greaterThan(min)

    // Approve and deposit 30 BUSD in the vault on behalf of the holders
    const depositAmount = 30n * 10n ** 18n
    await depositToVault(holderA, depositAmount, vault)
    await depositToVault(holderB, depositAmount, vault)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n)

    // Withdraw some BUSD from the vault on behalf of the holders
    const withdrawalAmount = 15n * 10n ** 18n
    await withdrawFromVault(holderA, withdrawalAmount, vault)
    await withdrawFromVault(holderB, withdrawalAmount, vault)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n - withdrawalAmount * 2n)
  })

  it('Should deposit and withdraw from the vault after investing to the strategy', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holder has some amount of BUSD (e.g., >300)
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(300n * 10n ** 18n)

    // Approve and deposit 30 BUSD in the vault on behalf of the holder
    const depositAmount = 30n * 10n ** 18n
    await depositToVault(holderA, depositAmount, vault)

    // Transfer deposited amount of BUSD from the vault to the strategy
    // Track is: Vault -> Strategy -> ApeSwap's cToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, cTokenAddress],
      [-depositAmount, 0, depositAmount],
    )

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdrawFromVault(holderA, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, cTokenAddress, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  it('Should deposit and withdraw from the vault after investing to the strategy (multiple users)', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of BUSD (e.g., >300)
    const min = 300n * 10n ** 18n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)
    expect(await assetToken.balanceOf(holderB.address)).to.be.greaterThan(min)

    // Approve and deposit 30 BUSD in the vault on behalf of the holders
    const depositAmount = 30n * 10n ** 18n
    await depositToVault(holderA, depositAmount, vault)
    await depositToVault(holderB, depositAmount, vault)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n)

    // Transfer deposited amount of BUSD from the vault to the strategy
    // Track is: Vault -> Strategy -> ApeSwap's cToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, cTokenAddress],
      [-depositAmount * 2n, 0, depositAmount * 2n],
    )

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdrawFromVault(holderA, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, cTokenAddress, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
    await withdrawFromVault(holderB, withdrawalAmount, vault, {
      addresses: [vaultAddress, strategyAddress, cTokenAddress, holderB.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  const shouldAccumulateRewards = async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Rewards address should be empty on start
    expect(await vault.balanceOf(rewardsAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of BUSD (e.g., >300)
    const min = 300n * 5n * 10n ** 18n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)

    // Make N deposits and reports
    for (let i = 0; i < 5; i++) {
      await logSnapshot(`[${i + 1}] Before deposit:`)

      const depositAmount = 300n * 10n ** 18n
      await depositToVault(holderA, depositAmount, vault)

      await logSnapshot(`[${i + 1}] After deposit:`)

      await strategy.work()
      await warp(minReportInterval + 60)
    }

    await logSnapshot('Before work:')

    // Wait 6h to accumulate the interest
    await warp(6 * 60 * 60)
    await strategy.work()

    await logSnapshot('After work:')

    // Rewards address should have some vault shares
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(0)
  }

  it('Should accumulate rewards', shouldAccumulateRewards)

  it('Should accumulate rewards in treasury', async () => {
    const treasuryAddress = await vault.rewards()
    expect(treasuryAddress).not.to.be.equal(ZeroAddress)

    // Treasury is an owner by default
    const [owner] = await ethers.getSigners()
    expect(treasuryAddress).to.be.equal(owner.address)

    // Treasury is empty at start
    expect(await vault.balanceOf(treasuryAddress)).to.be.equal(0)

    await shouldAccumulateRewards()

    // Some rewards (vault shares) were accumulated in treasury
    expect(await vault.balanceOf(treasuryAddress)).to.be.greaterThan(1)
  })

  async function logSnapshot(prefix: string) {
    if (process.env.ENABLE_TEST_LOGS !== 'true') {
      return
    }

    console.log(prefix, {
      holder: await assetToken.balanceOf(holderA.address),
      vault: await assetToken.balanceOf(vaultAddress),
      strategy: await assetToken.balanceOf(strategyAddress),
      balanceInCToken: await strategy.depositedBalanceSnapshot(),
      cToken: await assetToken.balanceOf(cTokenAddress),
    })
  }
})
