import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export async function getDeploymentEvents(contractAddress: string, eventName: string, hre: HardhatRuntimeEnvironment) {
  const contractName = await getContractNameByAddress(contractAddress, hre)
  const contract = await hre.ethers.getContractAt(contractName, contractAddress)
  const eventFilter = contract.filters[eventName]()
  const block = await hre.ethers.provider.getBlock('latest')

  // Specify lookup page size to prevent "limit exceeded" error.
  // This is the maximum value that the BSC endpoint allows you to look past,
  // but it's enough to get recent events from deployment.
  const step = 4

  const blockNumber = block!.number
  return await contract.queryFilter(eventFilter, blockNumber - step, blockNumber)
}

async function getContractNameByAddress(contractAddress: string, hre: HardhatRuntimeEnvironment): Promise<string> {
  const proxies = await hre.proxyRegister.read()
  const contractNames = Object.keys(proxies)
  return contractNames
    .find(contractName => Object.values(proxies[contractName]!)
    .includes(contractAddress))!
}
