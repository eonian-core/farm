import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {ERC20} from "../generated/Vault/ERC20"
import { Token } from "../generated/schema"
import * as logger from './logger'
import { WithContext } from "./Context";

export class TokenService extends WithContext {

    /** 
     * Creates new token if it not exsits 
     * or return it in another case 
     * */
    getOrCreateToken(contractAddress: Address): Token {
        const id = Bytes.fromHexString(contractAddress.toHexString())
        let token = Token.load(id);
        if(token) {
            return token;
        }

        logger.info("[getOrCreateToken] Creating new token entity for {}", [contractAddress.toHexString()], this.contractAddress, this.event)
        token = new Token(id);
        const contract = ERC20.bind(contractAddress)

        logger.info("[getOrCreateToken] Filling token entity for {}", [contractAddress.toHexString()], this.contractAddress, this.event)
        token.address = contractAddress.toHexString();
        token.name = contract.name();
        token.symbol = contract.symbol();
        token.decimals = contract.decimals();

        logger.debug('[getOrCreateToken] token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()], this.contractAddress, this.event)
        logger.debug('[getOrCreateToken] token entity state {} {} {}', [token.address, token.name, token.symbol], this.contractAddress, this.event)

        token.save()

        return token;
    }
}

