import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { TokenSymbol } from '../../types'
import { Chain, NetworkEnvironment } from '../../types'

type Lookup<T> = Partial<Record<Chain, Partial<Record<NetworkEnvironment | 'ANY', T>>>>
export type LookupMap = Lookup<string> | Lookup<Partial<Record<TokenSymbol, string>>>

export abstract class BaseProvider {
  protected readonly ANY_ENVIRONMENT = 'ANY'

  protected chain!: Chain
  protected environment!: NetworkEnvironment

  protected abstract get name(): string

  constructor(protected hre: HardhatRuntimeEnvironment) {}

  protected abstract getLookupMap(): LookupMap | PromiseLike<LookupMap>

  public async getAddress(): Promise<string> {
    const address = await this.resolveLookupValue()
    if (typeof address !== 'string') {
      throw new TypeError(`Expected "string" value, but got "${typeof address}. Use "${this.getAddressForToken.name}" function instead!`)
    }
    const isValid = await this.validateAddress(address, null)
    if (!isValid) {
      throw new Error(`Declared address ${address} is not valid!`)
    }
    return address
  }

  public async getAddressForToken(token: TokenSymbol): Promise<string> {
    const addresses = await this.resolveLookupValue()
    if (typeof addresses !== 'object') {
      throw new TypeError(`Expected "object" value, but got "${typeof addresses}. Use "${this.getAddress.name}" function instead!`)
    }
    const address = addresses[token]
    if (!address) {
      throw new Error(`There is no address defined for token ${token}, available addresses: ${JSON.stringify(addresses)}!`)
    }
    const isValid = await this.validateAddress(address, token)
    if (!isValid) {
      throw new Error(`Declared address ${address} for token ${token} is not valid!`)
    }
    return address
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  protected async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    return Promise.resolve(true)
  }

  private async resolveLookupValue(): Promise<string | Partial<Record<TokenSymbol, string>>> {
    const [chain, networkEnvironment] = this.parseHardhatNetworkName(this.hre.network.name)
    const map = await this.getLookupMap()
    const chainData = map[chain]
    const lookupValue = chainData?.[networkEnvironment] ?? chainData?.[this.ANY_ENVIRONMENT]
    if (!lookupValue) {
      throw new Error(`Unable to resolve address of ${this.name} (chain: ${chain}, environment: ${networkEnvironment})!`)
    }
    return lookupValue
  }

  private parseHardhatNetworkName(network: string): [Chain, NetworkEnvironment] {
    const parts = network.split('_')
    if (parts.length !== 3) {
      throw new Error(`Invalid network format: ${network}!`)
    }

    const [chainString,, environmentString] = parts
    const chain = Object.values(Chain).find(chain => chain.toLowerCase() === chainString)
    if (!chain) {
      throw new Error(`Unable to resolve chain from: ${network}, got: ${chainString}!`)
    }

    const environment = Object.values(NetworkEnvironment).find(env => env.toLowerCase() === environmentString)
    if (!environment) {
      throw new Error(`Unable to resolve environment from: ${network}, got: ${environmentString}!`)
    }

    return [this.chain = chain, this.environment = environment]
  }
}
