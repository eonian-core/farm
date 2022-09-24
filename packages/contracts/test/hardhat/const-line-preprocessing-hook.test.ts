import hre from "hardhat";
import { expect } from "chai";
import { ApeLendingStrategy } from "../../typechain";
import constantMap from "../../hardhat/const-map.json";
import { createLinePreprocessor } from "../../hardhat/const-line-preprocessing-hook";

describe("Integration with hardhat-preprocessor", function () {
  it("Should change constants values on compile", async function () {
    const constants = constantMap as Record<string, any>;
    if (Object.keys(constants).indexOf(hre.network.name) < 0) {
      this.skip();
    }

    const factory = await hre.ethers.getContractFactory("ApeLendingStrategy");
    const contract = (await factory.deploy()) as ApeLendingStrategy;

    const constantValues = constants[hre.network.name];
    const values = await Promise.all([
      await contract.BANANA(),
      await contract.RAIN_MAKER(),
    ]);

    expect(values).to.have.all.members([
      constantValues["BANANA"],
      constantValues["RAIN_MAKER"],
    ]);
  });
});

describe("createLinePreprocessor", function () {
  let networkName: string;
  let sources: string;
  let absolutePath: string;
  let constantMap: Record<string, any>;
  let sourceInfo: { absolutePath: string };

  beforeEach(() => {
    networkName = "network";
    sources = "/";
    absolutePath = sources + "file.txt";
    constantMap = {
      [networkName]: {
        CONST_A: 1,
        CONST_B: 2,
      },
    };
    sourceInfo = { absolutePath };
  });

  it("Should not create preprocessor if constant map is empty", async function () {
    constantMap = {};
    const result = createPreprocessor();
    expect(result).to.be.undefined;
  });

  it("Should not create preprocessor if file path is not in sources directory", async function () {
    sources = "/src";
    absolutePath = "/tmp/file.txt";
    const result = createPreprocessor();
    expect(result).to.be.undefined;
  });

  it("Should cache preprocessing function", async function () {
    const fnA = createPreprocessor();
    const fnB = createPreprocessor();
    expect(fnA).to.be.equal(fnB);

    absolutePath = sources + "file2.txt";
    const fnC = createPreprocessor();
    expect(fnC).is.not.equal(fnA);
  });

  const testValues = [
    "123",
    '"string"',
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "1 ether",
  ];
  testValues.forEach((value) => {
    it(`Should transform single line declaration (value: ${value})`, () => {
      const linePreprocessor = createPreprocessor();
      const given = `address public constant CONST_A = ${value};`;
      const expected = "address public constant CONST_A = 1;";
      const result = linePreprocessor?.(given, sourceInfo);
      expect(result).to.be.equal(expected);
    });

    it(`Should transform single line declaration with comments (value: ${value})`, () => {
      const linePreprocessor = createPreprocessor();
      const given = `address public constant CONST_A = ${value}; // CONST_A = ${value}`;
      const expected = `address public constant CONST_A = 1; // CONST_A = ${value}`;
      const result = linePreprocessor?.(given, sourceInfo);
      expect(result).to.be.equal(expected);
    });

    it(`Should transform multiple lines declaration (value: ${value})`, () => {
      const linePreprocessor = createPreprocessor();
      const given = ["address public constant CONST_A =", `${value};`];
      const expected = ["address public constant CONST_A =", "1;"];
      const result = given.map((value) =>
        linePreprocessor?.(value, sourceInfo)
      );
      expect(result).to.have.all.members(expected);
    });
  });

  function createPreprocessor() {
    return createLinePreprocessor(
      networkName,
      sources,
      absolutePath,
      constantMap
    );
  }
});
