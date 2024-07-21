import { Etherscan } from '@nomicfoundation/hardhat-verify/etherscan'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import debug from 'debug'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../environment/NetworkEnvironment'
import { RetryOnFailureOptions, retryOnFailureWithDelay, timeout } from '../sendTxWithRetry'

export class EtherscanVerifierAdapter {
  private log: debug.Debugger = debug(EtherscanVerifierAdapter.name)

  constructor(
    private hre: HardhatRuntimeEnvironment,
    public safetyDelay: number = 5000
  ) { }

  public isVerificationDisabled() {
    const networkEnvironment = resolveNetworkEnvironment(this.hre)
    if (networkEnvironment === NetworkEnvironment.LOCAL) {
      this.log(`Verification is disabled on "${networkEnvironment}" environment!`)
      return true
    }

    return false
  }

  /** Will verify contract if it not verified, can accidentally verify proxy impleemention also */
  public async verifyIfNeeded(address: string, constructorArgs: unknown[]): Promise<boolean | undefined> {
    this.log(`Will verify contract if need for address: "${address}" on etherscan...`)
    if (this.isVerificationDisabled()) {
      return false
    }

    if (await this.isContractVerified(address)) {
      this.log('No need to verify, contract are already verified!')
      return false
    }

    return await this.verifyAndCheck(address, constructorArgs)
  }

  public async verifyAndCheck(address: string, constructorArgs: unknown[]) {

    const isVerified = async (): Promise<boolean> => {
      this.log(`Will wait for ${this.safetyDelay}ms till verification is tracked by etherscan, and check if it was successful...`)
      await timeout(this.safetyDelay)
      return await this.isContractVerified(address) ?? false
    }

    const message = await this.verifyWithRetry(address, constructorArgs, isVerified)
    if (!(await isVerified())) {
      console.log('Verification was not successful!', message)
      return false
    }

    this.log(`Contract "${address}" have been verified on etherscan!`)
    return true
  }

  /** 
   * Will attempt to verify contract even if it was verified before, can accidentialy verify proxy implementation,
   * will retry verification in case of failure.
   * */
  public async verifyWithRetry(
    address: string,
    constructorArguments: unknown[],
    isSuccesfull: () => Promise<boolean>,
    retryOptions: RetryOnFailureOptions = { retries: 3, delay: 1000 }
  ): Promise<string | undefined> {
    this.log(`Starting to verify deployed (or upgraded) contracts: ${address}`)

    try {
      this.log(`Will wait for ${this.safetyDelay}ms in case contact is not yet available for etherscan`)
      await timeout(this.safetyDelay)

      return await retryOnFailureWithDelay(retryOptions, async () => {
        const message = await this.tryToVerify(address, constructorArguments)

        if (!(await isSuccesfull())) {
          console.warn(`Verification for ${address} failed!`, message)
          // trigger retry of verification
          throw new Error(`Verification for ${address} failed!`)
        }

        return message
      })
    } catch (e) {
      console.warn(`Error during contract verification: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  public async tryToVerify(address: string, constructorArguments: unknown[],): Promise<string> {
    this.log(`Attempt to verify ${address}...`)

    return await this.interceptOutput(async () => {
      await this.hre.run('verify:verify', { address, constructorArguments })
    })
  }

  public async isContractVerified(address: string): Promise<boolean | undefined> {
    try {
      const { network, config } = this.hre
      const chainConfig = await Etherscan.getCurrentChainConfig(network.name, network.provider, config.etherscan.customChains)
      const etherscan = Etherscan.fromChainConfig(config.etherscan.apiKey, chainConfig)

      this.log(`Checking if the contract ${address} is verified...`)
      const isProxyVerified = await etherscan.isVerified(address)
      return isProxyVerified
    }
    catch (e) {
      console.warn('Error during verification check', e)
      return undefined
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
