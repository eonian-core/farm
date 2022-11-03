import hre from "hardhat";
import { expect } from "chai";
import {
  ApeLendingStrategy,
  ApeLendingStrategy__factory,
  ICToken,
  IERC20,
  IERC20Metadata,
  Vault,
} from "../../typechain";
import { Contract, Signer } from "ethers";
import resetFork from "./helpers/reset-fork";
import deployVault from "./helpers/deploy-vault";
import { sign } from "crypto";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { binanceSmartChainFork } from "../../hardhat/forks";

describe("Ape Lending Strategy", function () {
  const { ethers } = hre;

  const holderAddress = binanceSmartChainFork.accounts["holder"]; // Holder (Binance Hot Wallet)
  const opsAddress = binanceSmartChainFork.accounts["ops"]; // Gelato BSC ops;
  const asset = "0x55d398326f99059ff775485246999027b3197955"; // USDT
  const cToken = "0xdbfd516d42743ca3f1c555311f7846095d85f6fd"; // oUSDT;
  const rewards = "0x89C7a4F5dB815dd6EdD81606f95B931B2B82BdCD";
  const nativePriceFeed = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee"; // Chainlink BNB/USD feed
  const assetPriceFeed = "0xb97ad0e74fa7d920791e90258a6e2085088b4320"; // Chainlink USDT/USD feed

  hre.tracer.nameTags[holderAddress] = "Holder";
  hre.tracer.nameTags[asset] = "USDT";
  hre.tracer.nameTags[cToken] = "cToken";
  hre.tracer.nameTags[rewards] = "Rewards";

  let owner: SignerWithAddress;
  let holder: SignerWithAddress;
  let ops: SignerWithAddress;

  let vault: Vault;
  let strategy: ApeLendingStrategy;
  let assetToken: IERC20 & Contract;

  async function setup() {
    [owner] = await ethers.getSigners();
    holder = await ethers.getSigner(holderAddress);
    ops = await ethers.getSigner(opsAddress);

    await helpers.impersonateAccount(holderAddress);
    await helpers.impersonateAccount(opsAddress);

    vault = await deployVault(hre, { asset, rewards, signer: owner });
    hre.tracer.nameTags[vault.address] = "Vault";

    strategy = await deployStrategy({ signer: owner, vault });
    hre.tracer.nameTags[strategy.address] = "Strategy";

    assetToken = await getToken(asset);
  }

  beforeEach(async function () {
    await helpers.loadFixture(setup);
  });

  it("Should deposit and withdraw from the vault", async function () {
    assetToken = assetToken.connect(holder);

    // Vault is empty, no USDT amount on the token balance
    const startVaultBalance = await assetToken.balanceOf(vault.address);
    expect(startVaultBalance).to.be.equal(0);

    // Make sure that the holder has some amount of USDT (e.g., >300)
    const startHolderBalance = await assetToken.balanceOf(holderAddress);
    expect(startHolderBalance).to.be.greaterThan(300n * 10n ** 18n);

    vault = vault.connect(holder);

    // Approve and deposit 30 USDT in the vault on behalf of the holder
    const depositAmount = 30n * 10n ** 18n;
    await assetToken.approve(vault.address, depositAmount);
    await expect(
      await vault["deposit(uint256)"](depositAmount)
    ).changeTokenBalances(
      assetToken,
      [vault.address, holder],
      [depositAmount, -depositAmount]
    );

    // Withdraw 15 USDT from the vault
    const withdrawalAmount = 15n * 10n ** 18n;
    await expect(
      await vault["withdraw(uint256)"](withdrawalAmount)
    ).changeTokenBalances(
      assetToken,
      [vault.address, holder],
      [-withdrawalAmount, withdrawalAmount]
    );
  });

  it("Should deposit and withdraw from the vault afther investing to the strategy", async function () {
    assetToken = assetToken.connect(holder);

    // Vault is empty, no USDT amount on the token balance
    const startVaultBalance = await assetToken.balanceOf(vault.address);
    expect(startVaultBalance).to.be.equal(0);

    // Make sure that the holder has some amount of USDT (e.g., >300)
    const startHolderBalance = await assetToken.balanceOf(holderAddress);
    expect(startHolderBalance).to.be.greaterThan(300n * 10n ** 18n);

    vault = vault.connect(holder);

    // Approve and deposit 30 USDT in the vault on behalf of the holder
    const depositAmount = 30n * 10n ** 18n;
    await assetToken.approve(vault.address, depositAmount);
    await expect(
      await vault["deposit(uint256)"](depositAmount)
    ).changeTokenBalances(
      assetToken,
      [vault.address, holder],
      [depositAmount, -depositAmount]
    );

    // Transfer deposited amount of USDT from the vault to the strategy
    // Track is: Vault -> Strategy -> ApeSwap's cToken contract
    await expect(await strategy.work()).changeTokenBalances(
      assetToken,
      [vault.address, strategy.address, cToken],
      [-depositAmount, 0, depositAmount]
    );

    // Withdraw 15 USDT from the vault
    const withdrawalAmount = 15n * 10n ** 18n;
    await expect(
      await vault["withdraw(uint256)"](withdrawalAmount)
    ).changeTokenBalances(
      assetToken,
      [vault.address, strategy.address, cToken, holder.address],
      [0, 0, -withdrawalAmount, withdrawalAmount]
    );
  });

  async function deployStrategy(options: {
    signer: SignerWithAddress;
    vault: Vault;
  }): Promise<ApeLendingStrategy> {
    const { signer, vault } = options;
    const factory =
      await ethers.getContractFactory<ApeLendingStrategy__factory>(
        "ApeLendingStrategy",
        signer
      );
    const contract = await factory.deploy();
    await contract.deployed();

    let tx = await contract.initialize(
      vault.address,
      cToken,
      opsAddress,
      nativePriceFeed,
      assetPriceFeed,
      3600, // Min report interval
      true // Job is prepaid
    );
    await tx.wait();

    tx = await vault.addStrategy(contract.address, 10000, {
      from: signer.address,
    });
    await tx.wait();

    return contract;
  }

  async function getToken(token: string): Promise<IERC20 & Contract> {
    return await ethers.getContractAt<IERC20 & Contract>(
      "IERC20",
      token,
      owner
    );
  }
});
