import { ChainId } from "./wallet-chain-id";

describe("ChainId", () => {
  it("Should transform id to hex", () => {
    expect(ChainId.toHex(ChainId.BSC_MAINNET)).toBe("0x38");
    expect(ChainId.toHex(ChainId.SEPOLIA)).toBe("0xaa36a7");
  });

  it("Should parse string", () => {
    expect(ChainId.parse("0x38")).toBe(ChainId.BSC_MAINNET);
    expect(ChainId.parse("0xaa36a7")).toBe(ChainId.SEPOLIA);

    expect(ChainId.parse(56)).toBe(ChainId.BSC_MAINNET);
    expect(ChainId.parse(11155111)).toBe(ChainId.SEPOLIA);

    expect(ChainId.parse('56')).toBe(ChainId.BSC_MAINNET);
    expect(ChainId.parse('11155111')).toBe(ChainId.SEPOLIA);

    expect(ChainId.parse(1)).toBe(ChainId.UNKNOWN);
    expect(ChainId.parse('1')).toBe(ChainId.UNKNOWN);
    expect(ChainId.parse('0x1')).toBe(ChainId.UNKNOWN);
  });
});
