import { BigNumberish, Overrides, Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  VaultFounderToken,
  VaultFounderToken__factory,
} from "../../../typechain-types";

async function _deployVaultFounderToken(
  this: any,
  hre: HardhatRuntimeEnvironment,
  signer?: Signer | string,
  ...params: Parameters<VaultFounderToken["initialize"]>
): Promise<VaultFounderToken> {
  const factory =
    await hre.ethers.getContractFactory<VaultFounderToken__factory>(
      "VaultFounderToken",
      signer
    );
  const contract = await factory.deploy(false);
  await contract.deployed();

  const transaction = await contract.initialize.call(this, ...params);
  await transaction.wait();

  return contract;
}

type Options = {
  maxCountTokens: BigNumberish;
  nextTokenPriceMultiplier: BigNumberish;
  initialTokenPrice: BigNumberish;
  admin: string;
  overrides?: Overrides & { from?: string | Promise<string> };
  signer?: Signer | string;
};

export default async function deployVaultFounderToken(
  hre: HardhatRuntimeEnvironment,
  options: Options
): Promise<VaultFounderToken> {
  const { signer, ...specifiedParams } = options;
  const params = [...Object.values(specifiedParams)] as Parameters<
    VaultFounderToken["initialize"]
  >;
  return await _deployVaultFounderToken(hre, signer, ...params);
}
