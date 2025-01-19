import type { HardhatRuntimeEnvironment } from 'hardhat/types'

export function getMinReportInterval(hre: HardhatRuntimeEnvironment, defaultValue: number) {
  if (hre.network.name === 'hardhat') { // Only for tests
    const interval = +(process.env.TEST_STRATEGY_MIN_REPORT_INTERVAL || defaultValue)
    if (interval !== defaultValue) {
      console.log(`[!] Min. report interval value is set to ${interval}`)
    }
    return interval
  }
  return defaultValue
}
