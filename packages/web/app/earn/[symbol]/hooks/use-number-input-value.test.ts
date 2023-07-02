import { parseBigIntValue, parseValue, ValueParseResult } from "./use-number-input-value";

describe("parseValue", () => {
  const validData: [string | number, ValueParseResult, number][] = [
    ["1.0", [1, "1.0", 10n ** 18n], 18],
    ["1", [1, "1", 10n ** 18n], 18],
    [1, [1, "1", 10n ** 18n], 18],
    [1.0, [1, "1", 10n ** 18n], 18],

    ["5.0", [5, "5.0", 5n * 10n ** 9n], 9],
    ["5", [5, "5", 5n * 10n ** 9n], 9],
    [5, [5, "5", 5n * 10n ** 9n], 9],
    [5.0, [5, "5", 5n * 10n ** 9n], 9],

    ["0.1234", [0.1234, "0.1234", 1234n * 10n ** 5n], 9],
    [0.1234, [0.1234, "0.1234", 1234n * 10n ** 5n], 9],
  ];
  it.each(validData)("Should parse valid input", (input, result, decimals) => {
    const values = parseValue(input, decimals);
    expect(values).toEqual(result);
  });
});

describe("parseBigIntValue", () => {
  const validData: [bigint, ValueParseResult, number][] = [
    [10n ** 18n, [1, "1", 10n ** 18n], 18],
    [5n * 10n ** 9n, [5, "5", 5n * 10n ** 9n], 9],

    [12345n, [0.000012345, "0.000012345", 12345n], 9],
    [12345n, [0.000000000000012345, "0.000000000000012345", 12345n], 18],
    [
      1234567891011n,
      [0.000001234567891011, "0.000001234567891011", 1234567891011n],
      18,
    ],
    [9300000000000000001n, [9.3, "9.3", 9300000000000000001n], 18],
  ];
  it.each(validData)("Should parse valid input", (input, result, decimals) => {
    const values = parseBigIntValue(input, decimals);
    expect(values).toEqual(result);
  });
});
