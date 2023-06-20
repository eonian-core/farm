import {
    ethereum,
    Address
} from "@graphprotocol/graph-ts";



export class Context {
    public event: ethereum.Event

    constructor(event: ethereum.Event) {
        this.event = event;
    }
}

export class WithContext {
    public ctx: Context;

    constructor(public event: ethereum.Event) {
        this.ctx = new Context(event);
    }

    get contractAddress(): Address {
        return this.event.address;
    }

    get contractAddressHex(): string {
        return this.event.address.toHexString();
    }
}