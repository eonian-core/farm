import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { NetworkEnvironment, resolveNetworkEnvironment } from '../environment/NetworkEnvironment'
import { Chain, resolveChain } from '../chains'
import { TokenSymbol } from '../tokens/TokenSymbol'

type Lookup<T> = Partial<Record<Chain, Partial<Record<NetworkEnvironment | 'ANY_ENVIRONMENT', T>>>>
export type LookupMap = Lookup<string> | Lookup<Partial<Record<TokenSymbol, string>>>

export abstract class BaseAddresses {
  protected chain!: Chain
  protected environment!: NetworkEnvironment

  constructor(protected hre: HardhatRuntimeEnvironment) {}

  protected abstract getLookupMap(): LookupMap | PromiseLike<LookupMap>

  public async getAddress(): Promise<string> {
    const address = await this.resolveLookupValue()
    if (typeof address !== 'string') {
      this.throwError(`Expected "string" value, but got "${typeof address}". Use "${this.getAddressForToken.name}" function instead!`)
    }
    const isValid = await this.validateAddress(address, null)
    if (!isValid) {
      this.throwError(`Declared address ${address} is not valid!`)
    }
    return address
  }

  public async getAddressForToken(token: TokenSymbol): Promise<string> {
    const addresses = await this.resolveLookupValue()
    if (typeof addresses !== 'object') {
      this.throwError(`Expected "object" value, but got "${typeof addresses}". Use "${this.getAddress.name}" function instead!`)
    }
    const address = addresses[token]
    if (!address) {
      this.throwError(`There is no address defined for token ${token}, available addresses: ${JSON.stringify(addresses)}!`)
    }
    const isValid = await this.validateAddress(address, token)
    if (!isValid) {
      this.throwError(`Declared address ${address} for token ${token} is not valid!`)
    }
    return address
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  protected async validateAddress(address: string, token: TokenSymbol | null): Promise<boolean> {
    return Promise.resolve(true)
  }

  protected throwError(message: string): never {
    throw new Error(`[${this.constructor.name}] ${message}`)
  }

  private async resolveLookupValue(): Promise<string | Partial<Record<TokenSymbol, string>>> {
    const [chain, networkEnvironment] = this.resolveChainAndEnvironment()
    const map = await this.getLookupMap()
    const chainData = map[chain]
    const lookupValue = chainData?.[networkEnvironment] ?? chainData?.ANY_ENVIRONMENT
    if (!lookupValue) {
      this.throwError(`Unable to resolve address (chain: ${chain}, environment: ${networkEnvironment})!`)
    }
    return lookupValue
  }

  private resolveChainAndEnvironment(): [Chain, NetworkEnvironment] {
    const chain = resolveChain(this.hre)
    const environment = resolveNetworkEnvironment(this.hre)
    return [this.chain = chain, this.environment = environment]
  }
}
