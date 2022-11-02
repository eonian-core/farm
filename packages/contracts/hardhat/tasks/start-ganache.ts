import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import debug from "debug";
import kill from "tree-kill";
import { task } from "hardhat/config";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import {
  HardhatNetworkConfig,
  HardhatRuntimeEnvironment,
  HttpNetworkConfig,
  RunSuperFunction,
} from "hardhat/types";

import { ForkData } from "../forks";

const enum ErrorReason {
  RESOURCE_NOT_AVAILABLE = "RESOURCE_NOT_AVAILABLE",
  OTHER = "OTHER",
}

type GanacheError = {
  reason: ErrorReason;
  code: number | null;
};

// Add "DEBUG" env. variable with "ganache*" to see the logs from this file.
const log = debug("ganache");
const logError = log.extend("error");
const logDebug = log.extend("debug");

/**
 * Starts the ganache on hardhat "test" command (only if the name of the current network is "ganache").
 * Kills the ganache RPC server process once all the tests are done.
 */
task(TASK_TEST, async (_args, env, runSuper) => {
  if (env.network.name !== "ganache") {
    log('Current network is not "ganache", skipping...');
    return await runSuper();
  }
  await runTask(env, runSuper);
});

async function runTask(
  env: HardhatRuntimeEnvironment,
  runSuper: RunSuperFunction<unknown>,
  attempt = 0
) {
  try {
    console.log(
      `Starting ganache... ${attempt ? `Attempt: ${attempt + 1}` : ""}`.trim()
    );
    const childProcess = await startGanache(env);
    if (!childProcess?.pid) {
      throw Error("Unable to start ganache!");
    }

    const { url } = env.network.config as HttpNetworkConfig;
    console.log(
      `Ganache is up and running on ${url ?? "http://127.0.0.1:8545"}!`
    );

    await runSuper();

    const { pid } = childProcess;
    if (pid) {
      console.log(`Stopping ganache (PID: ${pid})...`);
      await killProcess(pid);
    }
  } catch (error: unknown) {
    // Retry to start if there was a network error.
    if (
      isGanacheError(error) &&
      error.reason === ErrorReason.RESOURCE_NOT_AVAILABLE
    ) {
      await runTask(env, runSuper, ++attempt);
      return;
    }
    console.error(error);
  }
}

/**
 * Starts the ganache RPC server by executing yarn command.
 * @param hre Hardhat runtime environment (configuration)
 * @returns Spawned child process of the ganache RPC server
 */
async function startGanache(
  hre: HardhatRuntimeEnvironment
): Promise<ChildProcessWithoutNullStreams | null> {
  const { forking } = hre.network.config as HardhatNetworkConfig;
  if (!forking) {
    logError("Fork configuration is not specified");
    return null;
  }

  // Don't spawn the ganache if the fork is not needed ("undefined" is considered "true").
  if (forking.enabled == false) {
    logError("Fork is disabled");
    return null;
  }

  const processOptions = [
    "ganache",
    "--miner.blockTime",
    "0",
    "--fork.url",
    forking.url,
    "--fork.requestsPerSecond",
    "3",
    "--wallet.totalAccounts",
    "3",
  ];

  if (forking.blockNumber !== undefined) {
    processOptions.push("--fork.blockNumber", forking.blockNumber + "");
  }

  const serverOptions = getServerOptions(hre);
  if (serverOptions) {
    const [host, port] = serverOptions;
    processOptions.push("--server.host", host, "--server.port", port);
  }

  const unlockedAccounts = getUnlockedAccounts(hre);
  if (unlockedAccounts.length > 0) {
    unlockedAccounts.forEach((account) => {
      processOptions.push("--wallet.unlockedAccounts", account);
    });
  }

  const childProcess = spawn("yarn", processOptions);

  // We should kill the ganache process when the main process has been stopped.
  process.on("exit", function () {
    const { pid } = childProcess;
    pid !== undefined && killProcess(pid);
  });

  // Sometimes the ganache process is still running after the main process has been closed with "CTRL + C".
  const cleanExit = function () {
    process.exit();
  };
  process.on("SIGINT", cleanExit);
  process.on("SIGTERM", cleanExit);

  let errorReason: ErrorReason | null = null;
  let isGanacheStarted: boolean = false;

  return new Promise<ChildProcessWithoutNullStreams | null>(
    (resolve, reject) => {
      childProcess.stdout.on("data", (data) => {
        const message = data.toString();

        // Once ganache is started, we write logs to debug, to hide "eth_*" calls in the console.
        isGanacheStarted ? logDebug(message) : log(message);

        // Sometimes ganache is failing with "Resouse is not available" error,
        // In this case we should catch this exception and try to run ganache again.
        if (message.includes("code: -32002")) {
          errorReason = ErrorReason.RESOURCE_NOT_AVAILABLE;
        }

        // If we get this message, it means that the ganache server is running.
        if (message.includes("Listening on")) {
          isGanacheStarted = true;
          resolve(childProcess);
        }
      });

      childProcess.stderr.on("data", (data) => {
        logError(data.toString());
      });

      childProcess.on("exit", (code) => {
        log(`Ganache stopped with code: ${code ?? -1}`);

        if (code === 0) {
          resolve(null);
          return;
        }

        reject(<GanacheError>{
          reason: errorReason ?? ErrorReason.OTHER,
          code: resolveErrorCode(errorReason) ?? code,
        });
      });

      childProcess.on("error", reject);
    }
  );
}

/**
 * Kills the specified process.
 * In our case we use the "tree-kill" package because yarn command
 * spawns child processes and we need to get rid of the whole tree.
 */
async function killProcess(pid: number) {
  return new Promise<void>((resolve, reject) => {
    kill(pid, (error) => {
      error ? reject(error) : resolve();
    });
  });
}

function resolveErrorCode(errorReason: ErrorReason | null): number | null {
  switch (errorReason) {
    case ErrorReason.RESOURCE_NOT_AVAILABLE:
      return -32002;
    default:
      return null;
  }
}

function isGanacheError(error: any): error is GanacheError {
  return "reason" in error;
}

function getServerOptions(
  hre: HardhatRuntimeEnvironment
): [string, string] | null {
  const { url } = hre.network.config as HttpNetworkConfig;
  if (!url) {
    return null;
  }
  const [, host, port] = url.replace(/[^0-9a-zA-Z.:]/g, "").split(":");
  return [host, port];
}

function getUnlockedAccounts(hre: HardhatRuntimeEnvironment): string[] {
  const { forking } = hre.network.config as HardhatNetworkConfig;
  const { accounts } = forking as ForkData;
  return accounts ? Object.values(accounts) : [];
}
