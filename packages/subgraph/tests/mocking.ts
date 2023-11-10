import { Address, ethereum } from '@graphprotocol/graph-ts'
import { createMockedFunction } from 'matchstick-as'
import { ILogger } from '../src/logger'

// Hardcoded in matchstic but not exported :(
// can cause failed tests if will be changed in library
export const defaultAddress = Address.fromString('0xA16081F360e3847006dB660bae1c6d1b2e17eC2A')

export function mockViewFunction(contractAddress: Address, name: string, resultType: string, resultValue: ethereum.Value[]): void {
  createMockedFunction(contractAddress, name, `${name}():(${resultType})`)
    .withArgs([])
    .returns(resultValue)
}

export class MockLogger implements ILogger {
  info(_message: string, _args: Array<string>): void {
  }

  warn(_message: string, _args: Array<string>): void {
  }

  error(_message: string, _args: Array<string>): void {
  }

  debug(_message: string, _args: Array<string>): void {
  }
}
