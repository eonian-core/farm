import { Address, Bytes } from '@graphprotocol/graph-ts'
import { ERC20 } from '../generated/Vault/ERC20'
import { Token } from '../generated/schema'
import { ILogger, WithLogger } from './logger'
import { Context } from './Context'
import { IPriceService } from './price/price-service'

export class TokenService extends WithLogger {
  constructor(ctx: Context, logger: ILogger, public priceService: IPriceService) {
    super(ctx, logger)
  }

  /**
     * Creates a new token if it does not exist
     * or return it in another case
     * */
  getOrCreateToken(contractAddress: Address): Token {
    const id = Bytes.fromHexString(contractAddress.toHexString())
    let token = Token.load(id)
    if (token) {
      return token
    }

    this.logger.info('Creating new token entity for {}', [contractAddress.toHexString()])
    token = new Token(id)
    const contract = ERC20.bind(contractAddress)

    this.logger.info('Filling token entity for {}', [contractAddress.toHexString()])
    token.address = contractAddress.toHexString()
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()

    const price = this.priceService.createOrUpdate(token.symbol, contractAddress)
    token.price = price.id

    this.logger.debug('Token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()])
    this.logger.debug('Token entity state {} {} {}', [token.address, token.name, token.symbol])

    token.save()

    return token
  }
}
