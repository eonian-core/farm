import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { TokenSymbol } from '@eonian/upgradeable'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import _ from 'lodash'
import type { ContractName } from 'hardhat/types'
import { clearDeployments } from '../../deploy/helpers'
import { deployTaskAction } from '../../../hardhat/tasks'
import { Addresses } from '../../../hardhat/deployment'
import type { BaseStrategy, IERC20, Vault } from '../../../typechain-types'
import { getContractAt } from '../helpers/get-contract-at'
import { getAddress } from '../helpers/get-address'
import { depositToVault } from '../helpers/vault-deposit-withdraw'
import warp from '../helpers/warp'
import { Strategy } from '../../../hardhat/tasks/deploy/strategy-deployment-plan'
import { expectAlmostEqual } from '../helpers/expect-almost-equal'

const { ethers } = hre
const token = TokenSymbol.USDC

describeDebtRatioChange(Strategy.AAVE_V3, 'AaveSupplyStrategy')
describeDebtRatioChange(Strategy.APESWAP, 'ApeLendingStrategy')

function describeDebtRatioChange(startegy: Strategy, contractName: ContractName) {
  describe(`Test debt ratio change (${startegy})`, () => suite(startegy, contractName))
}

function suite(startegy: Strategy, contractName: ContractName) {
  clearDeployments(hre)

  const minReportInterval = 3600

  let holderA: HardhatEthersSigner
  let holderB: HardhatEthersSigner

  let vault: Vault
  let assetToken: IERC20

  let vaultAddress: string
  let rewardsAddress: string

  let strategy: BaseStrategy
  let strategyAddress: string

  async function setup() {
    process.env.TEST_STRATEGY_MIN_REPORT_INTERVAL = String(minReportInterval)

    await deployTaskAction(hre, { [startegy]: [token] })

    vault = await getContractAt<Vault>('Vault', token)
    vaultAddress = await vault.getAddress()

    holderA = await ethers.getSigner('0x8894e0a0c962cb723c1976a4421c95949be2d4e3') // Binance Hot Wallet #6
    await helpers.impersonateAccount(holderA.address)

    holderB = await ethers.getSigner('0xF977814e90dA44bFA03b6295A0616a897441aceC') // Binance Hot Wallet #20
    await helpers.impersonateAccount(holderB.address)

    const gelatoAddress = await getAddress(Addresses.GELATO)
    await helpers.impersonateAccount(gelatoAddress)

    strategy = await getContractAt<BaseStrategy>(contractName, token)
    strategyAddress = await strategy.getAddress()

    const assetAddress = await getAddress(Addresses.TOKEN, token)
    assetToken = await hre.ethers.getContractAt('IERC20', assetAddress)
    rewardsAddress = await vault.rewards()

    await verifyBalances()
  }

  it('Should re-allocate strategy funds when debt ratio is decreased', async () => {
    const amountToDeposit = 30n * 10n ** 18n

    // Debt ratio is 10000 (max) for the existing strategy, all funds are assigned to it
    {
      const totalDebtRatio = await vault.debtRatio()
      const max = await vault.MAX_BPS()
      expect(totalDebtRatio).to.be.eq(max)

      const strategyDebtRatio = await vault['currentDebtRatio(address)'](strategyAddress)
      expect(strategyDebtRatio).to.be.eq(max)
    }

    // All deposited funds should be allocated to the first strategy (due to max ratio)
    {
      await depositToVault(holderA, amountToDeposit, vault)

      await strategy.work()

      // There should be no profit, loss or debt payment after the first harvest (work), thestrategy just took funds from the vault.
      await expectHarvestEvent(strategy, {
        profit: 0n,
        loss: 0n,
        debtPayment: 0n,
        outstandingDebt: 0n,
      })

      const totalDebt = await vault.totalDebt()
      expect(totalDebt).to.be.eq(amountToDeposit)

      const strategyDebt = await vault['currentDebt(address)'](strategyAddress)
      expect(strategyDebt).to.be.eq(amountToDeposit)
    }

    // Decrease debt ratio for the strategy in half
    {
      const max = await vault.MAX_BPS()

      const ratio = max / 2n
      await vault.setBorrowerDebtRatio(strategyAddress, ratio)

      expect(await vault.debtRatio()).to.be.eq(ratio)
      expect(await vault['currentDebtRatio(address)'](strategyAddress)).to.be.eq(ratio)
    }

    // (Work #1) Strategy should start repaying half of the funds back to the vault
    {
      await warp(minReportInterval * 2)
      await strategy.work()

      const data = await getHarvestEventData(strategy)
      expect(data.profit).to.be.eq(0)
      expect(data.loss).to.be.eq(0)

      const half = amountToDeposit / 2n
      expect(data.debtPayment + data.outstandingDebt).to.be.eq(half)

      // After the first work, vault should mark excess half as "outstanding debt"
      expectAlmostEqual(half, data.outstandingDebt)
    }

    // (Work #2) Strategy should give all the extra funds back to the vault (as debt payment)
    {
      await warp(minReportInterval * 2)
      await strategy.work()

      const data = await getHarvestEventData(strategy)

      // On this step strategy has some profit
      expect(data.profit).to.be.greaterThan(0)
      expect(data.loss).to.be.eq(0)

      // Since strategy ratio is cutted on half, half of the profit should be taken by the vault
      const roundedProfit = data.profit % 2n === 1n ? (data.profit + 1n) : data.profit
      expect(data.outstandingDebt).to.be.eq(roundedProfit / 2n)

      // Half of the strategy deposits is taken by the vault
      expectAlmostEqual(amountToDeposit / 2n, data.debtPayment)
    }

    // (Work #3) Strategy should repay the debt from the previous "work"
    // and provide half of the profit as an outstanding debt to the vault again.
    {
      await warp(minReportInterval * 2)
      await strategy.work()

      const data = await getHarvestEventData(strategy)

      expect(data.profit).to.be.greaterThan(0)
      expect(data.loss).to.be.eq(0)
      expect(data.debtPayment).to.be.greaterThan(0)

      expectAlmostEqual(data.outstandingDebt, data.profit / 2n)
    }

    // (Work #4) Strategy should repay the outstanding debt from the previous "work",
    // and report about some extra profit it made. No more outstanding debt is expected.
    {
      await warp(minReportInterval * 2)
      await strategy.work()

      const data = await getHarvestEventData(strategy)
      expect(data.profit).to.be.greaterThan(0)
      expect(data.loss).to.be.eq(0)
      expect(data.debtPayment).to.be.greaterThan(0)
      expect(data.outstandingDebt).to.be.eq(0)
    }

    // (Work #5+) No more debt to pay,
    // strategy should operate normally and report about new profits
    for (let i = 0; i < 10; i++) {
      await warp(minReportInterval * 2)
      await strategy.work()

      const data = await getHarvestEventData(strategy)
      expect(data.profit).to.be.greaterThan(0)
      expect(data.loss).to.be.eq(0)
      expect(data.debtPayment).to.be.eq(0)
      expect(data.outstandingDebt).to.be.eq(0)
    }

    // Total vault assets should be equal to initial deposit (+ gained profit)
    expectAlmostEqual(await vault.fundAssets(), amountToDeposit)

    // Strategy should have just half of the vault's funds (estimated)
    expectAlmostEqual(await strategy.estimatedTotalAssets(), await vault.fundAssets() / 2n)
  })

  it('Should re-allocate strategy funds when debt ratio is increased', async () => {
    const amountToDeposit = 30n * 10n ** 18n

    // Immediately decrease debt ratio for the strategy in half
    {
      const max = await vault.MAX_BPS()

      const ratio = max / 2n
      await vault.setBorrowerDebtRatio(strategyAddress, ratio)

      expect(await vault.debtRatio()).to.be.eq(ratio)
      expect(await vault['currentDebtRatio(address)'](strategyAddress)).to.be.eq(ratio)
    }

    // Half of the deposited funds should be allocated to the first strategy
    {
      await depositToVault(holderA, amountToDeposit, vault)

      await strategy.work()

      // There should be no profit, loss or debt payment after the first harvest (work), thestrategy just took funds from the vault.
      await expectHarvestEvent(strategy, {
        profit: 0n,
        loss: 0n,
        debtPayment: 0n,
        outstandingDebt: 0n,
      })

      const totalAssets = await vault.fundAssets()
      expect(totalAssets).to.be.eq(amountToDeposit)

      const totalDebt = await vault.totalDebt()
      expect(totalDebt).to.be.eq(amountToDeposit / 2n)

      const strategyDebt = await vault['currentDebt(address)'](strategyAddress)
      expect(strategyDebt).to.be.eq(amountToDeposit / 2n)
    }

    // Increase debt ratio for the strategy back to the max
    {
      const max = await vault.MAX_BPS()
      await vault.setBorrowerDebtRatio(strategyAddress, max)

      expect(await vault.debtRatio()).to.be.eq(max)
      expect(await vault['currentDebtRatio(address)'](strategyAddress)).to.be.eq(max)
    }

    // (Work #1) Strategy should take missing funds from the vault after "work" is called
    {
      expectAlmostEqual(await strategy.estimatedTotalAssets(), amountToDeposit / 2n)

      await warp(minReportInterval * 2)
      await strategy.work()

      expectAlmostEqual(await strategy.estimatedTotalAssets(), amountToDeposit)

      const data = await getHarvestEventData(strategy)
      expect(data.profit).to.be.greaterThan(0n)
      expect(data.loss).to.be.eq(0n)
      expect(data.debtPayment).to.be.eq(0n)
      expect(data.outstandingDebt).to.be.eq(0n)
    }

    // (Work #2+) Strategy should operate normally
    for (let i = 0; i < 10; i++) {
      await warp(minReportInterval * 2)
      await strategy.work()

      expect(await strategy.estimatedTotalAssets()).to.be.greaterThan(amountToDeposit)

      const data = await getHarvestEventData(strategy)
      expect(data.profit).to.be.greaterThan(0n)
      expect(data.loss).to.be.eq(0n)
      expect(data.debtPayment).to.be.eq(0n)
      expect(data.outstandingDebt).to.be.eq(0n)
    }
  })

  /*********************************************
   * Helper functions
   *********************************************/

  async function verifyBalances() {
    await verifyEmptyBalances()

    const min = 300n * 10n ** 18n
    expect(await assetToken.balanceOf(holderA.address), 'low holderA balance').to.be.greaterThan(min)
    expect(await assetToken.balanceOf(holderB.address), 'low holderB balance').to.be.greaterThan(min)
  }

  async function verifyEmptyBalances() {
    await verifyStrategyEmptyBalance(strategy)
    expect(await vault['currentDebt()'](), 'currentDebt is not 0').to.be.eq(0n)
    expect(await assetToken.balanceOf(vaultAddress), 'vault balance is not 0').to.be.eq(0n)
    expect(await assetToken.balanceOf(rewardsAddress), 'rewards balance is not 0').to.be.eq(0n)
  }

  async function verifyStrategyEmptyBalance(strategy: BaseStrategy) {
    const name = await strategy.name()
    expect(await strategy.estimatedTotalAssets(), `total assets of ${name} is not 0`).to.be.eq(0n)

    const strategyAddress = await strategy.getAddress()
    expect(await assetToken.balanceOf(strategyAddress), `balance of ${name} is not 0`).to.be.eq(0n)
  }

  interface HarvestEventData { profit: bigint; loss: bigint; debtPayment: bigint; outstandingDebt: bigint }

  async function getHarvestEventData(strategy: BaseStrategy): Promise<HarvestEventData> {
    const filter = strategy.filters.Harvested
    const events = await strategy.queryFilter(filter, -1)
    if (events.length <= 0) {
      throw new Error('No harvest events found!')
    }
    const [profit, loss, debtPayment, outstandingDebt] = events[0].args
    return { profit, loss, debtPayment, outstandingDebt }
  }

  async function expectHarvestEvent(strategy: BaseStrategy, expected: ((data: HarvestEventData) => void) | HarvestEventData) {
    const data = await getHarvestEventData(strategy)

    if (typeof expected === 'function') {
      return expected(data)
    }
    expect(data, 'Unexpected data of the harvest event').to.be.deep.equal(expected)
  }

  beforeEach(async () => {
    await helpers.loadFixture(setup)
  })
}
