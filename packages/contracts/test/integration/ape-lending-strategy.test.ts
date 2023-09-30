import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import type {
  ApeLendingStrategy,
  IERC20,
  LossRatioHealthCheck,
  Vault,
  VaultFounderToken,
} from '../../typechain-types'
import { binanceSmartChainFork } from '../../hardhat/forks'
import deployVault from './helpers/deploy-vault'
import warp from './helpers/warp'
import getToken from './helpers/get-erc20-token'
import resetBalance from './helpers/reset-balance'
import deployVaultFounderToken from './helpers/deploy-vault-founder-token'

describe('Ape Lending Strategy', () => {
  const { ethers } = hre

  const minReportInterval = 3600

  const asset = '0xe9e7cea3dedca5984780bafc599bd69add087d56' // BUSD
  const cToken = '0x0096B6B49D13b347033438c4a699df3Afd9d2f96' // oBUSD;
  const rewards = '0x89C7a4F5dB815dd6EdD81606f95B931B2B82BdCD'
  const nativePriceFeed = '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee' // Chainlink BNB/USD feed
  const assetPriceFeed = '0xcbb98864ef56e9042e7d2efef76141f15731b82f' // Chainlink BUSD/USD feed

  hre.tracer.nameTags[asset] = 'BUSD'
  hre.tracer.nameTags[cToken] = 'cToken'
  hre.tracer.nameTags[rewards] = 'Rewards'

  let owner: HardhatEthersSigner
  let holderA: HardhatEthersSigner
  let holderB: HardhatEthersSigner
  let ops: HardhatEthersSigner

  let vault: Vault
  let vaultFounderToken: VaultFounderToken
  let healthCheck: LossRatioHealthCheck
  let strategy: ApeLendingStrategy
  let assetToken: IERC20

  let vaultAddress: string
  let vaultFounderTokenAddress: string
  let strategyAddress: string

  async function setup() {
    [owner] = await ethers.getSigners()
    holderA = await ethers.getSigner(binanceSmartChainFork.accounts.holderA)
    holderB = await ethers.getSigner(binanceSmartChainFork.accounts.holderB)
    ops = await ethers.getSigner(binanceSmartChainFork.accounts.ops)

    await helpers.impersonateAccount(holderA.address)
    hre.tracer.nameTags[holderA.address] = 'Holder A'
    await helpers.impersonateAccount(holderB.address)
    hre.tracer.nameTags[holderB.address] = 'Holder B'

    await helpers.impersonateAccount(ops.address)
    hre.tracer.nameTags[ops.address] = 'Gelato Ops'

    vault = await deployVault(hre, { asset, rewards, signer: owner })
    vaultAddress = await vault.getAddress()
    hre.tracer.nameTags[vaultAddress] = 'Vault'

    vaultFounderToken = await deployVaultFounderToken(hre, {
      maxCountTokens: 100,
      nextTokenPriceMultiplier: 1200,
      initialTokenPrice: 200,
      signer: owner,
      vault: vaultAddress,
    })
    vaultFounderTokenAddress = await vaultFounderToken.getAddress()
    await vault.setFounders(vaultFounderTokenAddress)
    await vaultFounderToken.setVault(vaultAddress)

    await resetBalance(vaultAddress, { tokens: [asset] })

    healthCheck = await deployLossRatioHealthCheck(owner)
    strategy = await deployStrategy({
      signer: owner,
      vault,
      asset,
      healthCheck,
    })
    strategyAddress = await strategy.getAddress()
    hre.tracer.nameTags[strategyAddress] = 'Strategy'

    await resetBalance(strategyAddress, { tokens: [cToken] })

    assetToken = await getToken(asset, owner)
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
    await deposit(holderA, depositAmount)

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdraw(holderA, withdrawalAmount)

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
    await deposit(holderA, depositAmount)
    await deposit(holderB, depositAmount)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n)

    // Withdraw some BUSD from the vault on behalf of the holders
    const withdrawalAmount = 15n * 10n ** 18n
    await withdraw(holderA, withdrawalAmount)
    await withdraw(holderB, withdrawalAmount)

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
    await deposit(holderA, depositAmount)

    // Transfer deposited amount of BUSD from the vault to the strategy
    // Track is: Vault -> Strategy -> ApeSwap's cToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, cToken],
      [-depositAmount, 0, depositAmount],
    )

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdraw(holderA, withdrawalAmount, {
      addresses: [vaultAddress, strategyAddress, cToken, holderA.address],
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
    await deposit(holderA, depositAmount)
    await deposit(holderB, depositAmount)

    // Check the deposits of the Vault
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(depositAmount * 2n)

    // Transfer deposited amount of BUSD from the vault to the strategy
    // Track is: Vault -> Strategy -> ApeSwap's cToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vaultAddress, strategyAddress, cToken],
      [-depositAmount * 2n, 0, depositAmount * 2n],
    )

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdraw(holderA, withdrawalAmount, {
      addresses: [vaultAddress, strategyAddress, cToken, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
    await withdraw(holderB, withdrawalAmount, {
      addresses: [vaultAddress, strategyAddress, cToken, holderB.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  it('Should accumulate rewards', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Rewards address should be empty on start
    expect(await vault.balanceOf(rewards)).to.be.equal(0)

    // Make sure that the holders have some amount of BUSD (e.g., >300)
    const min = 3000n * 5n * 10n ** 18n
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(min)

    // Make N deposits and reports
    for (let i = 0; i < 5; i++) {
      const depositAmount = 3000n * 10n ** 18n
      await deposit(holderA, depositAmount)

      await strategy.work()
      await warp(minReportInterval)
    }

    // Wait 1 day to accumulate the interest
    await warp(60 * 60 * 24)

    await strategy.work()

    // Rewards address should have some vault shares
    expect(await assetToken.balanceOf(holderA.address)).to.be.greaterThan(0)
  })

  /**
   * Approve and deposit some BUSDs in the vault on behalf of the specified holder
   * @param holder A signer of the transaction
   * @param amount Amount of tokens to deposit
   * @param changeTokenBalances Params for "changeTokenBalances" check
   */
  async function deposit(
    holder: HardhatEthersSigner,
    amount: bigint,
    changeTokenBalances?: { addresses: any[]; balanceChanges: any[] },
  ) {
    assetToken = assetToken.connect(holder)
    vault = vault.connect(holder)
    await assetToken.approve(vaultAddress, amount)
    await expect(await vault['deposit(uint256)'](amount)).changeTokenBalances(
      assetToken,
      changeTokenBalances?.addresses ?? [vaultAddress, holder.address],
      changeTokenBalances?.balanceChanges ?? [amount, -amount],
    )
  }

  /**
   * Withdraw some BUSDs from the vault on behalf of the specified holder
   * @param holder A signer of the transaction
   * @param amount Amount of tokens to withdraw
   * @param changeTokenBalances Params for "changeTokenBalances" check
   */
  async function withdraw(
    holder: HardhatEthersSigner,
    amount: bigint,
    changeTokenBalances?: { addresses: any[]; balanceChanges: any[] },
  ) {
    assetToken = assetToken.connect(holder)
    vault = vault.connect(holder)
    await expect(await vault['withdraw(uint256)'](amount)).changeTokenBalances(
      assetToken,
      changeTokenBalances?.addresses ?? [vaultAddress, holder.address],
      changeTokenBalances?.balanceChanges ?? [-amount, amount],
    )
  }

  async function deployLossRatioHealthCheck(signer: HardhatEthersSigner): Promise<LossRatioHealthCheck> {
    const factory = await ethers.getContractFactory('LossRatioHealthCheck', signer)

    const contract = await factory.deploy(false)
    await contract.waitForDeployment()

    const tx = await contract.initialize(
      5_00, // lossRatio = 5%
    )
    await tx.wait()

    return contract
  }

  async function deployStrategy(options: {
    signer: HardhatEthersSigner
    vault: Vault
    asset: string
    healthCheck: LossRatioHealthCheck
  }): Promise<ApeLendingStrategy> {
    const { signer, vault, asset, healthCheck } = options
    const factory = await ethers.getContractFactory('ApeLendingStrategy', signer)
    const contract = await factory.deploy(false)
    await contract.waitForDeployment()

    let tx = await contract.initialize(
      vaultAddress,
      asset,
      cToken,
      ops.address,
      nativePriceFeed,
      assetPriceFeed,
      minReportInterval, // Min report interval
      true, // Job is prepaid,
      await healthCheck.getAddress(), //
    )
    await tx.wait()

    tx = await vault.addStrategy(await contract.getAddress(), 10000, {
      from: signer.address,
    })
    await tx.wait()

    return contract
  }
})
