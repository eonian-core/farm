import { HardhatRuntimeEnvironment } from 'hardhat/types';

const snapshots: Record<string, any> = {};

export default async function resetFork({ ethers }: HardhatRuntimeEnvironment, init: Function) {
  const makeSnapshot = async () => (snapshots[init.name] = await ethers.provider.send('evm_snapshot', []));

  const snapshot = snapshots[init.name];
  if (!snapshot) {
    await init();
  } else {
    await ethers.provider.send('evm_revert', [snapshot]);
  }
  await makeSnapshot();
}
