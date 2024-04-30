import { expect } from 'chai'
import { Chain } from '../Chain'
import { TokenSymbol, getTokenAddress } from '../TokenSymbol'

describe(getTokenAddress.name, () => {
  it('Should provide address of the token', () => {
    const USDT = getTokenAddress(Chain.BSC, TokenSymbol.USDT)
    expect(USDT).to.be.equal('0x55d398326f99059fF775485246999027B3197955')
  })

  it('Should throw if address is not found', () => {
    expect(() => getTokenAddress(Chain.BSC, TokenSymbol.BTCB)).to.throw(/Token info was not found/)
  })
})
