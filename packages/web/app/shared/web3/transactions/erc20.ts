import { ethers } from 'ethers'

import ERC20ABI from '../abi/ERC20.json'

interface ApproveERC20Params {
  tokenAddress: string
  spenderAddress: string
  amount: bigint
}

export async function approveERC20(
  signer: ethers.JsonRpcSigner,
  params: ApproveERC20Params,
): Promise<() => Promise<ethers.TransactionReceipt | null>> {
  const { tokenAddress, spenderAddress, amount } = params
  const contract = new ethers.Contract(tokenAddress, ERC20ABI, signer)
  const response = (await contract.approve(spenderAddress, amount)) as ethers.TransactionResponse
  return (): Promise<ethers.TransactionReceipt | null> => response.wait()
}
