import hre from 'hardhat'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import getToken from './get-erc20-token'

export default async function resetBalance(
  address: string,
  params: {
    tokens: string[]
  },
) {
  await helpers.impersonateAccount(address)

  const { ethers } = hre
  const { provider } = ethers

  const { tokens } = params

  await provider.send('hardhat_setBalance', [address, ethers.toBeHex(ethers.parseEther('10'))])

  for (const tokenAddress of tokens) {
    const token = await getToken(tokenAddress)
    const balance = await token.balanceOf(address)
    await token.transfer('0x000000000000000000000000000000000000dEaD', balance)
  }

  await provider.send('hardhat_setBalance', [address, '0x0'])

  await helpers.stopImpersonatingAccount(address)
}
