import { ethers } from "ethers";

import VaultABI from "../abi/Vault.json";

interface DepositParams {
  vaultAddress: string;
  amount: bigint;
}

export async function deposit(
  signer: ethers.JsonRpcSigner,
  params: DepositParams
): Promise<() => Promise<ethers.TransactionReceipt | null>> {
  const { vaultAddress, amount } = params;
  const contract = new ethers.Contract(vaultAddress, VaultABI, signer);
  const response: ethers.TransactionResponse = await contract.deposit(amount);
  return (): Promise<ethers.TransactionReceipt | null> => response.wait();
}
