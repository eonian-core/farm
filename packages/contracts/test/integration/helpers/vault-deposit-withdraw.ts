import hre from 'hardhat'
import type { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { expect } from 'chai'
import type { Vault } from '../../../typechain-types'

export async function depositToVault(
  holder: HardhatEthersSigner,
  amount: bigint,
  vault: Vault,
  changeTokenBalances?: { addresses: any[]; balanceChanges: any[] },
) {
  vault = vault.connect(holder)
  const vaultAddress = await vault.getAddress()
  const assetAddress = await vault.asset()
  const assetToken = (await hre.ethers.getContractAt('IERC20', assetAddress)).connect(holder)
  await assetToken.approve(vaultAddress, amount)
  await expect(await vault['deposit(uint256)'](amount)).changeTokenBalances(
    assetToken,
    changeTokenBalances?.addresses ?? [vaultAddress, holder.address],
    changeTokenBalances?.balanceChanges ?? [amount, -amount],
  )
}

export async function withdrawFromVault(
  holder: HardhatEthersSigner,
  amount: bigint,
  vault: Vault,
  changeTokenBalances?: { addresses: any[]; balanceChanges: any[] },
) {
  const assetAddress = await vault.asset()
  const assetToken = (await hre.ethers.getContractAt('IERC20', assetAddress)).connect(holder)
  vault = vault.connect(holder)
  await expect(await vault['withdraw(uint256)'](amount)).changeTokenBalances(
    assetToken,
    changeTokenBalances?.addresses ?? [await vault.getAddress(), holder.address],
    changeTokenBalances?.balanceChanges ?? [-amount, amount],
  )
}
