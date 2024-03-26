import { ethers, upgrades } from 'hardhat'

async function main() {
  const counterFactory = await ethers.getContractFactory('Counter')

  console.log('Deploying...')

  const counter = await upgrades.deployProxy(counterFactory, [20], {
    kind: 'uups',
    initializer: 'initialize',
  })

  await counter.waitForDeployment()

  console.log('Deployed', await counter.getAddress())
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
