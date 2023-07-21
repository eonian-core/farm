import { Address, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Vault/ERC20"
import { ChainLinkPriceFeed } from "../generated/Vault/ChainLinkPriceFeed";
import { Token } from "../generated/schema"
import { WithLogger } from './logger'
import { getPriceFeedAddress } from "./price-feeds";

export class TokenService extends WithLogger {

    /** 
     * Creates a new token if it does not exist 
     * or return it in another case 
     * */
    getOrCreateToken(contractAddress: Address): Token {
        const id = Bytes.fromHexString(contractAddress.toHexString())
        let token = Token.load(id);
        if (token) {
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
        token.price = this.getTokenPrice(token.symbol, contractAddress);

        this.logger.debug('Token contract state {} {} {}', [contractAddress.toHexString(), contract.name(), contract.symbol()])
        this.logger.debug('Token entity state {} {} {}', [token.address, token.name, token.symbol])

        token.save()

        return token;
    }

    getTokenPrice(symbol: string, contractAddress: Address): BigInt {
        // Check if the current token instance is an asset rather than a vault
        if (dataSource.address().equals(contractAddress)) {
            return BigInt.fromI64(0);
        }

        // Return 0, if there is no price feed for specific network or symbol
        const priceFeed = this.getChainLinkContract(symbol);
        if (priceFeed === null) {
            return BigInt.fromI64(0);
        }

        const result = priceFeed.try_latestRoundData();
        return !result.reverted ? result.value.getAnswer() : BigInt.fromI64(0);
    }

    getChainLinkContract(symbol: string): ChainLinkPriceFeed | null {
        const network = dataSource.network();
        const address = getPriceFeedAddress(symbol, network);
        if (address === null) {
            return null;
        }
        return ChainLinkPriceFeed.bind(address);
    }
}

