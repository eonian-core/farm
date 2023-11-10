import { task } from 'hardhat/config'

export const accountsTask = task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i]
    const balance = await account.getBalance()
    console.log(` - ${i} | ${account.address} | Balance: ${hre.ethers.utils.formatEther(balance)}`)
  }
})
