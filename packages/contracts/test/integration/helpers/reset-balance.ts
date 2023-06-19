import hre from "hardhat";
import getToken from "./get-erc20-token";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";

export default async function resetBalance(
  address: string,
  params: {
    tokens: string[];
  }
) {
  await helpers.impersonateAccount(address);

  const { ethers } = hre;
  const { provider } = ethers;

  const { tokens } = params;

  await provider.send("hardhat_setBalance", [
    address,
    ethers.utils.hexlify(ethers.utils.parseEther("10")),
  ]);

  const signer = await ethers.getSigner(address);
  for (const tokenAddress of tokens) {
    const token = await getToken(tokenAddress, signer);
    const balance = await token.balanceOf(address);
    await token.transfer("0x000000000000000000000000000000000000dEaD", balance);
  }

  await provider.send("hardhat_setBalance", [address, "0x0"]);

  await helpers.stopImpersonatingAccount(address);
}
