import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Context } from "./Context";
import { Logger } from "./logger";
import { TokenService } from "./token-service";
import { VaultService } from "./vault-service";

/** Build and inject dependencies */
export class DependencyContainer {
    public context: Context
    public logger: Logger
    public tokenService: TokenService
    public vaultService: VaultService

    constructor(public eventName: string, public event: ethereum.Event) {
        this.context = new Context(event, eventName);
        this.logger = new Logger(this.context);
        this.tokenService = new TokenService(this.context, this.logger);
        this.vaultService = new VaultService(this.context, this.logger, this.tokenService)
    }
}