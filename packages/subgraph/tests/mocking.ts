import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts"
import { createMockedFunction } from "matchstick-as";

// Hardcoded in matchstic but not exported :(
// can cause failed tests if will be changed in library
export const defaultAddress = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

export function mockViewFunction(contractAddress: Address, name: string, resultType: string, resultValue: ethereum.Value[]): void {
    createMockedFunction(contractAddress, name, name + "():(" + resultType + ")")
        .withArgs([])
        .returns(resultValue)
}
