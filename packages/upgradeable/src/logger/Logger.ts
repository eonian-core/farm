/// <reference path="../types.d.ts"/>
import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export class Logger {
  constructor(readonly hre: HardhatRuntimeEnvironment) {}

  log(...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.hre.deployments.log(...args)
  }

  warn(...args: any[]) {
    // TODO: Add Warn method
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.hre.deployments.log('[WARN]', ...args)
  }

  debug(...args: any[]) {
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.hre.deployments.log('[DEBUG]', ...args)
    }
  }
}
