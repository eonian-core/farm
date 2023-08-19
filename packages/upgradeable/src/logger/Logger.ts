import { HardhatRuntimeEnvironment } from 'hardhat/types';

export class Logger {
  constructor(readonly hre: HardhatRuntimeEnvironment) {}

  log(...args: any[]) {
    this.hre.deployments.log(...args);
  }

  warn(...args: any[]) {
    // TODO: Add Warn method
    this.hre.deployments.log('[WARN]', ...args);
  }

  debug(...args: any[]) {
    if (process.env.DEBUG === 'true') {
      this.hre.deployments.log('[DEBUG]', ...args);
    }
  }
}
