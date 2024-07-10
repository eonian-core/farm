import { Etherscan } from '@nomicfoundation/hardhat-verify/etherscan'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import debug from 'debug'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../environment/NetworkEnvironment'

export class EtherscanVerifier {
  private log: debug.Debugger = debug(EtherscanVerifier.name)

  constructor(private hre: HardhatRuntimeEnvironment) {}

  public async verifyIfNeeded(proxyAddress: string, constructorArgs?: unknown[]): Promise<boolean> {
    this.log(`Will verify proxy if need for address: "${proxyAddress}" on etherscan...`)
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    if (networkEnvironment === NetworkEnvironment.LOCAL) {
      this.log(`Verification is disabled on "${networkEnvironment}" environment!`)
      return false
    }

    const isVerified = await this.isContractVerified(proxyAddress)
    if (isVerified) {
      this.log('No need to verify, proxy and implementation contracts are already verified!')
      return false
    }

    this.log('Starting to verify deployed (or upgraded) contracts...')
    let message = ''
    try {
      message = await this.interceptOutput(async () => {
        await this.hre.run('verify:verify', {
          address: proxyAddress,
          constructorArguments: constructorArgs,
        })
      })
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
    catch (e) {
      console.error(`Error during proxy verification: ${e instanceof Error ? e.message : String(e)}`)
    }
    const success = await this.isContractVerified(proxyAddress)
    if (!success) {
      console.log('Verification was not successful!', message)
    }
    return success
  }

  private async isContractVerified(proxyAddress: string): Promise<boolean> {
    try {
      const { network, config } = this.hre
      const chainConfig = await Etherscan.getCurrentChainConfig(network.name, network.provider, config.etherscan.customChains)
      const etherscan = Etherscan.fromChainConfig(config.etherscan.apiKey, chainConfig)

      this.log('Checking if the proxy contract is verified...')
      const isProxyVerified = await etherscan.isVerified(proxyAddress)
      if (!isProxyVerified) {
        return false
      }

      this.log('Checking if the implementation contract is verified...')
      const implementationAddress = await this.hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
      return await etherscan.isVerified(implementationAddress)
    }
    catch (e) {
      console.error('Error during verification check', e)
      return false
    }
  }

  /**
   * Overrides console.* methods to prevent messages from code executed in {@param callback} from being output to stdout.
   * After the callback is executed, the "console" object will be reset,
   * and all messages that were passed to the console.* method will be output as debug messages.
   *
   * Used to prevent the hardhat subtask from sending unwanted messages to the console.
   */
  private async interceptOutput(callback: () => Promise<any>): Promise<string> {
    const fields = ['log', 'trace', 'debug', 'info', 'warn', 'error'] as const
    const messages: string[] = ['\n', 'Verification output:']
    function accumulateLogs(...input: string[]) {
      messages.push(`\t|\t${input.join(' ')}`)
    }
    const temp: Array<Console[keyof Console]> = []
    for (const field of fields) {
      temp.push(console[field])
      console[field] = accumulateLogs.bind(this)
    }
    try {
      await callback()
    }
    catch (e) {
      throw new Error(`Error: ${e instanceof Error ? e.message : String(e)}, output: \n\t${messages.join('\n\t')}`)
    }
    finally {
      for (let i = 0; i < fields.length; i++) {
        console[fields[i]] = temp[i] as VoidFunction
      }
      messages.push('\n')
    }
    return messages.join('\n')
  }
}
