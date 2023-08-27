import type { HardhatRuntimeEnvironment } from 'hardhat/types'

const snapshots: Record<string, any> = {}

export default async function resetFork({ ethers }: HardhatRuntimeEnvironment, init: () => Promise<void>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
  const makeSnapshot = async () => (snapshots[init.name] = await ethers.provider.send('evm_snapshot', []))

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const snapshot = snapshots[init.name]
  if (!snapshot) {
    await init()
  }
  else {
    await ethers.provider.send('evm_revert', [snapshot])
  }
  await makeSnapshot()
}
