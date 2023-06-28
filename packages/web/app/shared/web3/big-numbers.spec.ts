import { ethers } from "ethers";
import { toBigIntWithDecimals } from "./big-numbers";

describe("toBigIntWithDecimals", () => {
  it("Should format value", () => {
    let value = toBigIntWithDecimals(2.2, 18);
    expect(value).toBe(2200000000000000000n);
    expect(value).toBe(BigInt("22" + "0".repeat(17)));
    expect(value).toBe(ethers.parseEther("2.2"));

    value = toBigIntWithDecimals(5, 16);
    expect(value).toBe(50000000000000000n);
    expect(value).toBe(BigInt("5" + "0".repeat(16)));

    value = toBigIntWithDecimals(0.12345, 18);
    expect(value).toBe(123450000000000000n);
    expect(value).toBe(BigInt("12345" + "0".repeat(13)));
    expect(value).toBe(ethers.parseEther("0.12345"));

    value = toBigIntWithDecimals(500, 18);
    expect(value).toBe(500000000000000000000n);
    expect(value).toBe(BigInt("5" + "0".repeat(20)));

    value = toBigIntWithDecimals('0.000000000000000001', 18);
    expect(value).toBe(1n);

    value = toBigIntWithDecimals("0.000000000000000001000", 18);
    expect(value).toBe(1n);
  });

  it("Should throw exception if decimals point is too big", () => {
    const throwable = (value: number, decimals: number) => () => {
      toBigIntWithDecimals(value, decimals);
    }
    expect(throwable(0.01, 1)).toThrow(RangeError);
    expect(throwable(0.001, 1)).toThrow(RangeError);
    expect(throwable(0.00009, 3)).toThrow(RangeError);
  })
});
