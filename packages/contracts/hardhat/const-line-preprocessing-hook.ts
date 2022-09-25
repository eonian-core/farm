import { HardhatRuntimeEnvironment, LinePreprocessor } from "hardhat/types";
import constantMap from "./const-map.json";

const regExp = /(constant\s)(\w+)(\W?=\s*)(.*[^ ]+)\s*;/;

/**
 * Handles lines that looks like:
 * [0] uint256 internal constant CONST = VALUE;
 *
 * It doesn't yet handle multiple const declarations on the same line.
 */
const transformInlineConst = (
  constants: Record<string, any>,
  line: string
): string | undefined => {
  // Line is not a constant declaration - skip
  if (!line.includes(" constant ")) {
    return;
  }

  // Line is a comment - skip
  if (line.trim().startsWith("*") || line.trim().startsWith("/")) {
    return;
  }

  const transformedLine = line.replace(regExp, (match, constant, name, eq) => {
    const newValue = constants[name.trim()];
    return newValue ? constant + name + eq + newValue + ";" : match;
  });

  return transformedLine === line ? undefined : transformedLine;
};

/**
 * Handles lines of constant declarations that have been split into two, like:
 * [0] address internal constant CONST =  // Previuos line
 * [1]    0x000000000000000000000000000;  // Line
 */
const transformBrokeLineConst = (
  constants: Record<string, any>,
  line: string,
  previousLine?: string
): string | undefined => {
  // If there is no previous line and the current line has "constant" word - skip
  if (!previousLine || line.includes(" constant ")) {
    return;
  }

  const transformedLine = transformInlineConst(constants, previousLine + line);
  if (!transformedLine) {
    return;
  }

  // Get value from transformed line
  const value = regExp.exec(transformedLine)?.[4];
  if (!value) {
    return;
  }

  return value + ";";
};

const transform = (
  constants: Record<string, any>,
  line: string,
  previousLine?: string
): string => {
  return (
    transformInlineConst(constants, line) ||
    transformBrokeLineConst(constants, line, previousLine) ||
    line
  );
};

let _cache: { path?: string; transform?: LinePreprocessor } = {
  path: undefined,
  transform: undefined,
};

export const createLinePreprocessor = (
  networkName: string,
  sourcesDir: string,
  absolutePath: string,
  constantMap: Record<string, any>
): LinePreprocessor | undefined => {
  if (_cache.path === absolutePath) {
    return _cache.transform;
  }

  const constants = (constantMap as Record<string, any>)[networkName];
  if (!constants) {
    return;
  }

  const filter = absolutePath.includes(sourcesDir);
  if (!filter) {
    return;
  }

  let previousLine: string | undefined;
  let resultTransform: LinePreprocessor = (line: string) => {
    const result = transform(constants, line, previousLine);
    previousLine = line;
    return result;
  };

  _cache = {
    path: absolutePath,
    transform: resultTransform,
  };

  return resultTransform;
};

/**
 * Wrapper for hardhat preprocessor plugin
 */
export default function (
  { network, config }: HardhatRuntimeEnvironment,
  absolutePath: string
): LinePreprocessor | undefined {
  return createLinePreprocessor(
    network.name,
    config.paths.sources,
    absolutePath,
    constantMap
  );
}
