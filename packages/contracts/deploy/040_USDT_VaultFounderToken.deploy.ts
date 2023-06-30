import { deployOrUpgrade } from "../hardhat/deploy-or-upgrade";
import { BlockchainType } from "../hardhat.config";

/**
 * Deploy Vault Founder Token contract
 */
const func = deployOrUpgrade({
  contract: "VaultFounderToken",
  chains: [
    BlockchainType.Mainnet,
    BlockchainType.Testnet,
    BlockchainType.Local,
  ],
  tags: ["asset:USDT"],
  dependencies: ["Vault"],
  getArgs: () => [
    100, // maxCountTokens
    12_000, // nextTokenPriceMultiplier
    200, // initialTokenPrice
  ],
  afterDeploy: async ({ ethers, deployments: { log } }, Strategy, [vault]) => {
    log("Adding Vault to VaultFounderToken");
    const Vault = await ethers.getContractAt("Vault", vault.address);
    const VaultFounderToken = await ethers.getContract("VaultFounderToken");

    const txVault = await Vault.setFounders(VaultFounderToken.address);
    const resultAddingVaultFounderToken = await txVault.wait();
    log("VaultFounderToken added to vault", resultAddingVaultFounderToken);

    const txVaultFounderToken = await VaultFounderToken.setVault(Vault.address);
    const resultAddingVault = await txVaultFounderToken.wait();
    log("Vault added to VaultFounderToken", resultAddingVault);

    const grantMinterRole = await VaultFounderToken.grantRole(
      VaultFounderToken.MINTER_ROLE(),
      Vault.address
    );
    const resultGrantMinterRole = await grantMinterRole.wait();
    log("VaultFounderToken grant MINTER_ROLE to Vault", resultGrantMinterRole);

    const grantBalanceUpdaterRole = await VaultFounderToken.grantRole(
      VaultFounderToken.BALANCE_UPDATER_ROLE(),
      Vault.address
    );
    const resultGrantBalanceUpdaterRole = await grantBalanceUpdaterRole.wait();
    log(
      "VaultFounderToken grant BALANCE_UPDATER_ROLE to Vault",
      resultGrantBalanceUpdaterRole
    );
  },
});

export default func;
