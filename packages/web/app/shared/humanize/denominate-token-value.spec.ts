import { denominateTokenValue } from "./denominate-token-value";

describe("denominateTokenValue", () => {
  it("Should denomiate token value", () => {
    expect(denominateTokenValue("1" + "0".repeat(18), '18')).toBe(1);
    expect(denominateTokenValue(10n**18n, '18')).toBe(1);
    expect(denominateTokenValue("1" + "0".repeat(18), 18n)).toBe(1);
    expect(denominateTokenValue(10n**18n, 18n)).toBe(1);

    expect(denominateTokenValue("5" + "0".repeat(18), '18')).toBe(5);
    expect(denominateTokenValue(5n * 10n**18n, '17')).toBe(50);
    expect(denominateTokenValue("5" + "0".repeat(18), 16n)).toBe(500);
    expect(denominateTokenValue(7n * 10n**18n, 18n)).toBe(7);
  });
});
