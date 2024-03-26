import { ethers, upgrades } from 'hardhat'
import { Manifest } from '@openzeppelin/upgrades-core'

async function main() {
  const network = await ethers.provider.getNetwork()
  const chainId = Number(network.chainId)
  console.log('Chain', chainId)

  const manifest = new Manifest(chainId)
  const data = await manifest.read(3)
  const proxies = data.proxies.map(proxy => proxy.address)

  console.log(proxies)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
