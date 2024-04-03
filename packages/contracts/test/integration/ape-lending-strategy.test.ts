import hre from 'hardhat'
import { expect } from 'chai'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import type { BaseContract } from 'ethers'
import type {
  ApeLendingStrategy,
  IERC20,
  Vault,
} from '../../typechain-types'
import { Chain, ContractGroup, TokenSymbol } from '../../hardhat/types'
import { deployTaskAction } from '../../hardhat/tasks'
import { getProviders } from '../../hardhat/deployment/providers'
import warp from './helpers/warp'
import resetBalance from './helpers/reset-balance'
import { describeOnChain } from './helpers/describeOnChain'

describeOnChain(Chain.BSC, 'Ape Lending Strategy', () => {
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
    await deployTaskAction([token], hre)

    vault = await getContractAt<Vault>('Vault')
    vaultAddress = await vault.getAddress()
    // hre.tracer.nameTags[vaultAddress] = 'Vault'

    holderA = await ethers.getSigner('0x8894e0a0c962cb723c1976a4421c95949be2d4e3') // Binance Hot Wallet #6
    await helpers.impersonateAccount(holderA.address)
    // hre.tracer.nameTags[holderA.address] = 'Holder A'

    holderB = await ethers.getSigner('0xF977814e90dA44bFA03b6295A0616a897441aceC') // Binance Hot Wallet #20
    await helpers.impersonateAccount(holderB.address)
    // hre.tracer.nameTags[holderB.address] = 'Holder B'

    const gelatoAddress = await getAddress(ContractGroup.GELATO)
    await helpers.impersonateAccount(gelatoAddress)
    // hre.tracer.nameTags[gelatoAddress] = 'Gelato Ops'

    strategy = await getContractAt<ApeLendingStrategy>('ApeLendingStrategy')
    strategyAddress = await strategy.getAddress()
    // hre.tracer.nameTags[strategyAddress] = 'Strategy'

    const assetAddress = await getAddress(ContractGroup.TOKEN)
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
      [vaultAddress, strategyAddress, cTokenAddress],
      [-depositAmount, 0, depositAmount],
    )

    // Withdraw 15 BUSD from the vault
    const withdrawalAmount = 15n * 10n ** 18n
    await withdraw(holderA, withdrawalAmount, {
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
    await deposit(holderA, depositAmount)
    await deposit(holderB, depositAmount)

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
    await withdraw(holderA, withdrawalAmount, {
      addresses: [vaultAddress, strategyAddress, cTokenAddress, holderA.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
    await withdraw(holderB, withdrawalAmount, {
      addresses: [vaultAddress, strategyAddress, cTokenAddress, holderB.address],
      balanceChanges: [0, 0, -withdrawalAmount, withdrawalAmount],
    })
  })

  it('Should accumulate rewards', async () => {
    // Vault is empty, no BUSD amount on the token balance
    expect(await assetToken.balanceOf(vaultAddress)).to.be.equal(0)

    // Rewards address should be empty on start
    expect(await vault.balanceOf(rewardsAddress)).to.be.equal(0)

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

    // Wait 6h to accumulate the interest
    await warp(6 * 60 * 60)

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

  async function getAddress(contractName: string) {
    const address = await hre.proxyRegister.getProxyAddress(contractName, token)
    if (address) {
      return address
    }
    const addressProviders = getProviders(hre)
    const addressProvider = addressProviders[contractName as ContractGroup]
    if (addressProvider) {
      try {
        return await addressProvider.getAddressForToken(token)
      }
      catch (_e) {
        try {
          return await addressProvider.getAddress()
        }
        catch (_e) {
          // Ignore
        }
      }
    }
    throw new Error(`No address found for: ${contractName} (token: ${token})`)
  }

  async function getContractAt<R extends BaseContract>(contractName: string) {
    const address = await getAddress(contractName)
    return await hre.ethers.getContractAt(contractName, address) as unknown as R
  }
})
