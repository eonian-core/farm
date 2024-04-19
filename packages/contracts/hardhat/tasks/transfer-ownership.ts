import readline from 'node:readline/promises'
import { ZeroAddress } from 'ethers'
import { task } from 'hardhat/config'

const NEW_OWNER = ZeroAddress

task('transfer-ownership', async (args, hre) => {
  if (!NEW_OWNER || NEW_OWNER === ZeroAddress) {
    throw new Error('NEW_OWNER is not set!')
  }

  const [owner] = await hre.ethers.getSigners()
  const records = await hre.proxyRegister.getAll()

  const proceed = await askBoolean(`Going to transfer ownership (${owner.address} -> ${NEW_OWNER}) for ${records.length} proxies, do you want to continue?`)
  if (!proceed) {
    console.log('Canceled')
    return
  }

  const total = records.length
  let current = 0
  for (const record of records) {
    current++
    const label = `${record.contractName} (${record.id})`
    console.log(`[${current}/${total}] Setting owner for ${label}...`)

    const contract = await hre.ethers.getContractAt('OwnableUpgradeable', record.address)
    const currentOwner = await contract.owner()
    if (currentOwner !== owner.address && currentOwner !== NEW_OWNER) {
      throw new Error(`Proxy ${label} has unknown owner: ${currentOwner}`)
    }

    if (currentOwner === NEW_OWNER) {
      console.log(`Proxy ${label} already has new owner!`)
      continue
    }

    const proceed = await askBoolean(`Do you want to change ownership for ${label} (${record.address})?`)
    if (!proceed) {
      console.log('Canceled')
      return
    }

    const tx = await contract.transferOwnership(NEW_OWNER)
    await tx.wait()

    const newOwner = await contract.owner()
    if (newOwner === NEW_OWNER) {
      console.log(`Owner for proxy ${label} was sucessfully set!`)
      continue
    }

    throw new Error(`Owner for proxy ${label} was not set!`)
  }
})

async function askBoolean(message: string): Promise<boolean> {
  const io = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const data = await io.question(`${message} (yes/no): `)
  io.close()
  return ['yes', 'true', 'y', 't'].includes(data.toLowerCase())
}
