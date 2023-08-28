import { FractionPartView, formatNumberCompactWithThreshold } from './format-number'

describe('formatNumberCompactWithThreshold', () => {
  it('Should format with fraction digits set (DOTS)', () => {
    const format = (value: bigint, fractionDigits = 0, decimals = 9) =>
      formatNumberCompactWithThreshold(value, decimals, {
        fractionDigits,
        fractionPartView: FractionPartView.DOTS,
      })

    expect(format(120000000n, 2)).toBe('0.12')
    expect(format(120000001n, 2)).toBe('0.12..1')
    expect(format(123456789n, 2)).toBe('0.12..9')
    expect(format(123456789n, 3)).toBe('0.123..9')
    expect(format(123456789n, 8)).toBe('0.123456789')
    expect(format(123456789n, 0)).toBe('0.123456789')

    expect(format(9999999n, 2, 7)).toBe('0.99..9')
  })

  it('Should format with fraction digits set (G)', () => {
    const format = (value: bigint, fractionDigits = 0, decimals = 9) =>
      formatNumberCompactWithThreshold(value, decimals, {
        fractionDigits,
        fractionPartView: FractionPartView.GREATER_SIGN,
      })

    expect(format(120000000n, 2)).toBe('0.12')
    expect(format(120000001n, 2)).toBe('>0.12')
    expect(format(123456789n, 2)).toBe('>0.12')
    expect(format(123456789n, 3)).toBe('>0.123')
    expect(format(123456789n, 8)).toBe('>0.12345678')
    expect(format(123456789n, 0)).toBe('0.123456789')

    expect(format(9999999n, 2, 7)).toBe('>0.99')
  })

  it('Should format with fraction digits set (CUT)', () => {
    const format = (value: bigint, fractionDigits = 0, decimals = 9) =>
      formatNumberCompactWithThreshold(value, decimals, {
        fractionDigits,
        fractionPartView: FractionPartView.CUT,
      })

    expect(format(120000000n, 2)).toBe('0.12')
    expect(format(120000000n, 4)).toBe('0.12')
    expect(format(120000001n, 2)).toBe('0.12')
    expect(format(123456789n, 2)).toBe('0.12')
    expect(format(123456789n, 3)).toBe('0.123')
    expect(format(123456789n, 8)).toBe('0.12345678')
    expect(format(123456789n, 0)).toBe('0.123456789')

    expect(format(9999999n, 2, 7)).toBe('0.99')
  })

  it('Should format value', () => {
    const format = (value: bigint) => formatNumberCompactWithThreshold(value, 9)
    const getValue = (value: number) => BigInt(value) * 10n ** BigInt(9)

    expect(format(getValue(1e3))).toBe('1000.0')
    expect(format(getValue(1e5))).toBe('100000.0')
    expect(format(getValue(1e6))).toBe('1000000.0')
    expect(format(getValue(1e8))).toBe('100000000.0')
    expect(format(getValue(1e9))).toBe('1000000000.0')
    expect(format(getValue(1e11))).toBe('100000000000.0')
    expect(format(getValue(1e12))).toBe('1000000000000.0')
    expect(format(getValue(1e14))).toBe('100000000000000.0')
  })

  it('Should format value with threshold', () => {
    const getValue = (value: number) => BigInt(value) * 10n ** BigInt(9)
    const format = (value: bigint) =>
      formatNumberCompactWithThreshold(value, 9, {
        threshold: getValue(1e6),
      })

    expect(format(getValue(1e3))).toBe('1000.0')
    expect(format(getValue(1e5))).toBe('100000.0')
    expect(format(getValue(1e6))).toBe('1000000.0')
    expect(format(getValue(1e8))).toBe('100M')
    expect(format(getValue(1e9))).toBe('1B')
    expect(format(getValue(1e11))).toBe('100B')
    expect(format(getValue(1e12))).toBe('1T')
    expect(format(getValue(1e14))).toBe('100T')
  })

  it('Should format value with threshold and cap decimal part', () => {
    const getValue = (value: number) => BigInt(value) * 10n ** BigInt(9)
    const format = (value: bigint) =>
      formatNumberCompactWithThreshold(value, 9, {
        threshold: getValue(1e5),
        fractionDigits: 2,
      })

    expect(format(100123400000n)).toBe('100.12')
    expect(format(100666000000n)).toBe('100.66')
    expect(format(getValue(1e6))).toBe('1M')
    expect(format(2000000513200000n)).toBe('2M')
  })
})
