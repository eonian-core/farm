import {
    ethereum,
    Address
} from "@graphprotocol/graph-ts";



export class Context {
    
    constructor(
        public event: ethereum.Event,
        public eventName: string
    ) {
    }
}

export class WithContext {
    constructor(public ctx: Context) {
    }

    get event(): ethereum.Event {
        return this.ctx.event;
    }

    get contractAddress(): Address {
        return this.event.address;
    }

    get contractAddressHex(): string {
        return this.contractAddress.toHexString();
    }
}