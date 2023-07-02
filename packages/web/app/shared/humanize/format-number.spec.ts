import { formatNumberCompactWithThreshold, numberToString } from "./format-number";

describe("formatNumberCompactWithThreshold", () => {
  it("Should format value", () => {
    const format = (value: number) => formatNumberCompactWithThreshold(value);

    expect(format(1e3)).toBe("1K");
    expect(format(1e5)).toBe("100K");
    expect(format(1e6)).toBe("1M");
    expect(format(1e8)).toBe("100M");
    expect(format(1e9)).toBe("1B");
    expect(format(1e11)).toBe("100B");
    expect(format(1e12)).toBe("1T");
    expect(format(1e14)).toBe("100T");
  });

  it("Should format value with threshold", () => {
    const format = (value: number) =>
      formatNumberCompactWithThreshold(value, 1e6);

    expect(format(1e3)).toBe("1000");
    expect(format(1e5)).toBe("100000");
    expect(format(1e6)).toBe("1M");
    expect(format(1e8)).toBe("100M");
    expect(format(1e9)).toBe("1B");
    expect(format(1e11)).toBe("100B");
    expect(format(1e12)).toBe("1T");
    expect(format(1e14)).toBe("100T");
  });

  it("Should format value with threshold and cap decimal part", () => {
    const format = (value: number) =>
      formatNumberCompactWithThreshold(value, 1e6, 2);

    expect(format(100.1234)).toBe("100.12");
    expect(format(100.666)).toBe("100.67");
    expect(format(1e6)).toBe("1M");
    expect(format(2000000.5132)).toBe("2M");
  });
});

describe("numberToString", () => {
  it('Should convert numbers without e notation', () => {
    expect(numberToString(123, 18)).toEqual("123");
    expect(numberToString(13e18, 18)).toEqual("13000000000000000000");
    expect(numberToString(4e27, 18)).toEqual("4000000000000000000000000000");
  })
});
