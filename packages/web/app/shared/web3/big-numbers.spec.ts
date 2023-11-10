import { ethers } from 'ethers'
import { toBigIntWithDecimals, toStringNumberFromDecimals } from './big-numbers'

describe('toBigIntWithDecimals', () => {
  it('Should transform value', () => {
    let value = toBigIntWithDecimals(2.2, 18)
    expect(value).toBe(2200000000000000000n)
    expect(value).toBe(BigInt(`22${'0'.repeat(17)}`))
    expect(value).toBe(ethers.parseEther('2.2'))

    value = toBigIntWithDecimals(5, 16)
    expect(value).toBe(50000000000000000n)
    expect(value).toBe(BigInt(`5${'0'.repeat(16)}`))

    value = toBigIntWithDecimals(0.12345, 18)
    expect(value).toBe(123450000000000000n)
    expect(value).toBe(BigInt(`12345${'0'.repeat(13)}`))
    expect(value).toBe(ethers.parseEther('0.12345'))

    value = toBigIntWithDecimals(500, 18)
    expect(value).toBe(500000000000000000000n)
    expect(value).toBe(BigInt(`5${'0'.repeat(20)}`))

    value = toBigIntWithDecimals('0.000000000000000001', 18)
    expect(value).toBe(1n)

    value = toBigIntWithDecimals('0.000000000000000001000', 18)
    expect(value).toBe(1n)
  })

  it('Should throw exception if decimals point is too big', () => {
    const throwable = (value: number, decimals: number) => () => {
      toBigIntWithDecimals(value, decimals)
    }
    expect(throwable(0.01, 1)).toThrow(RangeError)
    expect(throwable(0.001, 1)).toThrow(RangeError)
    expect(throwable(0.00009, 3)).toThrow(RangeError)
  })
})

describe('toStringNumberFromDecimals', () => {
  it('Should transform value', () => {
    let value = toStringNumberFromDecimals(2200000000000000000n, 18)
    expect(value).toBe('2.2')

    value = toStringNumberFromDecimals(50000000000000000n, 16)
    expect(value).toBe('5.0')

    value = toStringNumberFromDecimals(5000000000000000000n, 18)
    expect(value).toBe('5.0')

    value = toStringNumberFromDecimals(500n, 2)
    expect(value).toBe('5.0')

    value = toStringNumberFromDecimals(500000000000000000000n, 18)
    expect(value).toBe('500.0')

    value = toStringNumberFromDecimals('500000000000000000000', 18)
    expect(value).toBe('500.0')

    value = toStringNumberFromDecimals(0n, 18)
    expect(value).toBe('0.0')

    value = toStringNumberFromDecimals(9299999999999999999n, 18)
    expect(value).toBe('9.299999999999999999')
  })
})
