import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {ERC20} from "../generated/Vault/ERC20"
import { Token } from "../generated/schema"
import {WithLogger} from './logger'

export class TokenService extends WithLogger {

    /** 
     * Creates a new token if it does not exist 
     * or return it in another case 
     * */
    getOrCreateToken(contractAddress: Address): Token {
        const id = Bytes.fromHexString(contractAddress.toHexString())
        let token = Token.load(id);
        if(token) {
            return token;
        }

        this.logger.info("Creating new token entity for {}", [contractAddress.toHexString()])
        token = new Token(id);
        const contract = ERC20.bind(contractAddress)

        this.logger.info("Filling token entity for {}", [contractAddress.toHexString()])
        token.address = contractAddress.toHexString();
        token.name = contract.name();
        token.symbol = contract.symbol();
        token.decimals = contract.decimals();

        this.logger.debug('Token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()])
        this.logger.debug('Token entity state {} {} {}', [token.address, token.name, token.symbol])

        token.save()

        return token;
    }
}

