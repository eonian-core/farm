import type { ValueParseResult } from './use-number-input-value'
import { parseBigIntValue, parseValue } from './use-number-input-value'

describe('parseValue', () => {
  const validData: [string, ValueParseResult, number][] = [
    ['1.0', [10n ** 18n, '1.0'], 18],
    ['1', [10n ** 18n, '1'], 18],
    ['5.0', [5n * 10n ** 9n, '5.0'], 9],
    ['5', [5n * 10n ** 9n, '5'], 9],
    ['0.1234', [1234n * 10n ** 5n, '0.1234'], 9],
  ]
  it.each(validData)('Should parse valid input', (input, result, decimals) => {
    const values = parseValue(input, decimals)
    expect(values).toEqual(result)
  })
})

describe('parseBigIntValue', () => {
  const validData: [bigint, ValueParseResult, number][] = [
    [10n ** 18n, [10n ** 18n, '1'], 18],
    [10n ** 18n + 25n * 10n ** 16n, [10n ** 18n + 25n * 10n ** 16n, '1.25'], 18],
    [5n * 10n ** 9n, [5n * 10n ** 9n, '5'], 9],
    [5n * 10n ** 9n + 5n * 10n ** 8n, [5n * 10n ** 9n + 5n * 10n ** 8n, '5.5'], 9],
    [12345n, [12345n, '0.000012345'], 9],
    [12345n, [12345n, '0.000000000000012345'], 18],
    [1234567891011n, [1234567891011n, '0.000001234567891011'], 18],
    [9300000000000000001n, [9300000000000000001n, '9.300000000000000001'], 18],
  ]
  it.each(validData)('Should parse valid input', (input, result, decimals) => {
    const values = parseBigIntValue(input, decimals)
    expect(values).toEqual(result)
  })
})
