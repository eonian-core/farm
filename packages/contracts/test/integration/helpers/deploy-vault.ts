import { BigNumber, BigNumberish, Overrides, Signer } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import _ from "lodash";
import { Vault, Vault__factory } from "../../../typechain-types";

async function _deployVault(
  this: any,
  hre: HardhatRuntimeEnvironment,
  signer?: Signer | string,
  ...params: Parameters<Vault["initialize"]>
): Promise<Vault> {
  const factory = await hre.ethers.getContractFactory<Vault__factory>(
    "Vault",
    signer
  );
  const contract = await factory.deploy(false);
  await contract.deployed();

  const transaction = await contract.initialize.call(this, ...params);
  await transaction.wait();

  return contract;
}

type Options = {
  asset: string;
  rewards: string;
  managementFee?: BigNumberish;
  lockedProfitReleaseRate?: BigNumberish;
  name?: string;
  symbol?: string;
  defaultOperators?: string[];
  foundersRewardFee?: BigNumberish;
  overrides?: Overrides & { from?: string | Promise<string> };
  signer?: Signer | string;
};

const defaultOptions: Partial<Options> = {
  managementFee: 1000, // 10%
  lockedProfitReleaseRate: BigNumber.from("1" + "0".repeat(18)).div(3600), // 6 hours
  name: "Vault Token",
  symbol: "VTN",
  defaultOperators: [],
  foundersRewardFee: 100, // 1%
};

export default async function deployVault(
  hre: HardhatRuntimeEnvironment,
  options: Options
): Promise<Vault> {
  const { signer, ...specifiedParams } = _.defaults(options, defaultOptions);
  const params = [...Object.values(specifiedParams)] as Parameters<
    Vault["initialize"]
  >;
  return await _deployVault(hre, signer, ...params);
}
