/* eslint-disable no-lone-blocks */
import hre from 'hardhat'
import { TokenSymbol } from '@eonian/upgradeable'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { Addresses } from '../../../hardhat/deployment'
import { deployTaskAction } from '../../../hardhat/tasks'
import { Strategy } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'
import type { BaseStrategy, IERC20, Vault } from '../../../typechain-types'
import { clearDeployments } from '../../deploy/helpers'
import { getContractAt } from '../helpers/get-contract-at'
import resetBalance from '../helpers/reset-balance'
import { getAddress } from '../helpers/get-address'
import { depositToVault, withdrawFromVault } from '../helpers/vault-deposit-withdraw'
import warp from '../helpers/warp'
import { expectAlmostEqual } from '../helpers/expect-almost-equal'

describe('Interaction with vault (multiple strategies)', () => {
  clearDeployments(hre)

  const { ethers } = hre

  const token = TokenSymbol.USDT
  const minReportInterval = 3600

  let holderA: HardhatEthersSigner
  let holderB: HardhatEthersSigner

  let strategyA: BaseStrategy
  let strategyAddressA: string

  let strategyB: BaseStrategy
  let strategyAddressB: string

  let vault: Vault
  let vaultAddress: string

  let assetToken: IERC20

  async function setup() {
    process.env.TEST_STRATEGY_MIN_REPORT_INTERVAL = String(minReportInterval)

    await deployTaskAction(hre, { [Strategy.APESWAP]: [token], [Strategy.AAVE_V3]: [token] })

    vault = await getContractAt<Vault>('Vault', token)
    vaultAddress = await vault.getAddress()

    holderA = await ethers.getSigner('0x8894e0a0c962cb723c1976a4421c95949be2d4e3') // Binance Hot Wallet #6
    await helpers.impersonateAccount(holderA.address)

    holderB = await ethers.getSigner('0xF977814e90dA44bFA03b6295A0616a897441aceC') // Binance Hot Wallet #20
    await helpers.impersonateAccount(holderB.address)

    const gelatoAddress = await getAddress(Addresses.GELATO)
    await helpers.impersonateAccount(gelatoAddress)

    strategyA = await getContractAt<BaseStrategy>('ApeLendingStrategy', token)
    strategyAddressA = await strategyA.getAddress()

    strategyB = await getContractAt<BaseStrategy>('AaveSupplyStrategy', token)
    strategyAddressB = await strategyB.getAddress()

    const assetAddress = await getAddress(Addresses.TOKEN, token)
    assetToken = await hre.ethers.getContractAt('IERC20', assetAddress)

    await resetBalance(vaultAddress, { tokens: [await vault.asset()] })

    // Both strategies have equal debt ratio (5000)
    const maxDebtRatio = await vault.MAX_BPS()
    await vault.setBorrowerDebtRatio(strategyAddressA, maxDebtRatio / 2n)
    await vault.setBorrowerDebtRatio(strategyAddressB, maxDebtRatio / 2n)

    expect(await vault['currentDebtRatio(address)'](strategyAddressA), 'Wrong ratio of A').to.be.eq(maxDebtRatio / 2n)
    expect(await vault['currentDebtRatio(address)'](strategyAddressB), 'Wrong ratio of B').to.be.eq(maxDebtRatio / 2n)

    // Ensure strategy A is first in "withdrawal" order
    expect(await vault.withdrawalQueue(0), 'Wrong order').to.be.eq(strategyAddressA)
    expect(await vault.withdrawalQueue(1), 'Wrong order').to.be.eq(strategyAddressB)
  }

  beforeEach(async () => {
    await helpers.loadFixture(setup)
  })

  it('Should deposit and withdraw from the vault', async () => {
    // Vault is empty, no USDT amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holder has some amount of USDT (e.g., >300)
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(300n * 10n ** 18n)

    // Approve and deposit 30 USDT in the vault on behalf of the holder
    const depositAmount = 30n * 10n ** 18n
    await depositToVault(holderA, depositAmount, vault)

    // Strategy A should take half of the vault's funds after work is called
    {
      await warp(minReportInterval * 2)
      await strategyA.work()
      expect(await assetToken.balanceOf(vaultAddress), '[work A] Wrong vault balance').to.be.eq(depositAmount / 2n)
      expectAlmostEqual(await strategyA.estimatedTotalAssets(), depositAmount / 2n, '[work A] Wrong A balance')
      expect(await vault['currentDebt(address)'](strategyAddressA), '[work A] Wrong A balance').to.be.eq(depositAmount / 2n)
      expect(await vault['currentDebt(address)'](strategyAddressB), '[work A] Wrong B balance').to.be.eq(0)
    }

    // Strategy B should take other half of the vault's funds after work is called
    {
      await warp(minReportInterval * 2)
      await strategyB.work()
      expect(await assetToken.balanceOf(vaultAddress), '[work B] Wrong vault balance').to.be.eq(0)
      expectAlmostEqual(await strategyB.estimatedTotalAssets(), depositAmount / 2n, '[work B] Wrong B balance')
      expect(await vault['currentDebt(address)'](strategyAddressA), '[work B] Wrong A balance').to.be.eq(depositAmount / 2n)
      expect(await vault['currentDebt(address)'](strategyAddressB), '[work B] Wrong B balance').to.be.eq(depositAmount / 2n)
    }

    await warp(minReportInterval * 2)
    await strategyA.work()
    await strategyB.work()

    // User should get some profit
    const userInvestment = await vault.maxWithdraw(holderA)
    expect(userInvestment).to.be.greaterThan(depositAmount)

    await withdrawFromVault(holderA, userInvestment, vault, {
      addresses: [holderA.address],
      balanceChanges: [userInvestment],
    })

    expect(await vault['currentDebt(address)'](strategyAddressA), 'Wrong strategy A debt').to.be.eq(0n)

    // Last strategy in the queue might have some small amount of leftover funds
    expect(await vault['currentDebt(address)'](strategyAddressB), 'Wrong strategy B debt').to.be.lessThan(10n ** 18n)
  })

  it('Should deposit and withdraw from the vault (multiple users)', async () => {
    // Vault is empty, no USDT amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Make sure that the holders have some amount of USDT (e.g., >300)
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(300n * 10n ** 18n)
    expect(await assetToken.balanceOf(holderB.address)).to.be.greaterThan(300n * 10n ** 18n)

    // Approve and deposit 30 USDT in the vault on behalf of the holder
    const depositAmount = 60n * 10n ** 18n
    await depositToVault(holderA, depositAmount / 2n, vault)
    await depositToVault(holderB, depositAmount / 2n, vault)

    // Strategy A should take half of the vault's funds after work is called
    {
      await warp(minReportInterval * 2)
      await strategyA.work()
      expect(await assetToken.balanceOf(vaultAddress), '[work A] Wrong vault balance').to.be.eq(depositAmount / 2n)
      expectAlmostEqual(await strategyA.estimatedTotalAssets(), depositAmount / 2n, '[work A] Wrong A balance')
      expect(await vault['currentDebt(address)'](strategyAddressA), '[work A] Wrong A balance').to.be.eq(depositAmount / 2n)
      expect(await vault['currentDebt(address)'](strategyAddressB), '[work A] Wrong B balance').to.be.eq(0)
    }

    // Strategy B should take other half of the vault's funds after work is called
    {
      await warp(minReportInterval * 2)
      await strategyB.work()
      expect(await assetToken.balanceOf(vaultAddress), '[work B] Wrong vault balance').to.be.eq(0)
      expectAlmostEqual(await strategyB.estimatedTotalAssets(), depositAmount / 2n, '[work B] Wrong B balance')
      expect(await vault['currentDebt(address)'](strategyAddressA), '[work B] Wrong A balance').to.be.eq(depositAmount / 2n)
      expect(await vault['currentDebt(address)'](strategyAddressB), '[work B] Wrong B balance').to.be.eq(depositAmount / 2n)
    }

    await warp(minReportInterval * 2)
    await strategyA.work()
    await strategyB.work()

    // Withdraw as holder A and get some profit above initial deposit
    {
      const userInvestment = await vault.maxWithdraw(holderA)
      expect(userInvestment).to.be.greaterThan(depositAmount / 2n)

      await withdrawFromVault(holderA, userInvestment, vault, {
        addresses: [holderA.address],
        balanceChanges: [userInvestment],
      })
    }

    // Withdraw as holder B and get some profit above initial deposit
    {
      const userInvestment = await vault.maxWithdraw(holderB)
      expect(userInvestment).to.be.greaterThan(depositAmount / 2n)

      await withdrawFromVault(holderB, userInvestment, vault, {
        addresses: [holderB.address],
        balanceChanges: [userInvestment],
      })
    }

    expect(await vault['currentDebt(address)'](strategyAddressA), 'Wrong strategy A debt').to.be.eq(0n)

    // Last strategy in the queue might have some small amount of leftover funds
    expect(await vault['currentDebt(address)'](strategyAddressB), 'Wrong strategy B debt').to.be.lessThan(10n ** 18n)
  })
})
