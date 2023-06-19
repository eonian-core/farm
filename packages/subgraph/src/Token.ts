import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {ERC20} from "../generated/Vault/ERC20"
import { Token } from "../generated/schema"
import * as logger from './logger'

/** Creates and saves the new token */
export function getOrCreateToken(contractAddress: Address, event: ethereum.Event): Token {
    const id = Bytes.fromHexString(contractAddress.toHexString())
    let token = Token.load(id);
    if(token) {
        return token;
    }

    logger.info("[getOrCreateToken] Creating new token entity for {}", [contractAddress.toHexString()], contractAddress, event)
    token = new Token(id);
    const contract = ERC20.bind(contractAddress)

    logger.info("[getOrCreateToken] Filling token entity for {}", [contractAddress.toHexString()], contractAddress, event)
    token.address = contractAddress.toHexString();
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.decimals = contract.decimals();

    logger.debug('[getOrCreateToken] token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()], contractAddress, event)
    logger.debug('[getOrCreateToken] token entity state {} {} {}', [token.address, token.name, token.symbol], contractAddress, event)

    token.save()
 
    return token
}