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

const enum ErrorReason {
  RESOURCE_NOT_AVAILABLE = "RESOURCE_NOT_AVAILABLE",
  OTHER = "OTHER",
}

type CustomError = {
  reason: ErrorReason;
  code: number | null;
};

// Add "DEBUG" env. variable with "start-hardhat-node*" to see the logs from this file.
const log = debug("start-hardhat-node");
const logError = log.extend("error");
const logDebug = log.extend("debug");

/**
 * Starts the node on hardhat "test" command (only if the name of the current network is "hardhat").
 * Kills the RPC server process once all the tests are done.
 */
task(TASK_TEST, async (_args, env, runSuper) => {
  if (env.network.name !== "hardhat") {
    log('Current network is not "hardhat", skipping...');
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
      `Starting node... ${attempt ? `Attempt: ${attempt + 1}` : ""}`.trim()
    );
    const childProcess = await startNode(env);
    if (!childProcess?.pid) {
      throw Error("Unable to start node!");
    }

    const { url } = env.network.config as HttpNetworkConfig;
    console.log(`Node is up and running on ${url ?? "http://127.0.0.1:8545"}!`);

    await runSuper();

    const { pid } = childProcess;
    if (pid) {
      console.log(`Stopping node (PID: ${pid})...`);
      await killProcess(pid);
    }
  } catch (error: unknown) {
    // Retry to start if there was a network error.
    if (
      isCustomError(error) &&
      error.reason === ErrorReason.RESOURCE_NOT_AVAILABLE
    ) {
      await runTask(env, runSuper, ++attempt);
      return;
    }
    throw error;
  }
}

/**
 * Starts the RPC server by executing yarn command.
 * @param hre Hardhat runtime environment (configuration)
 * @returns Spawned child process of the RPC server
 */
async function startNode(
  hre: HardhatRuntimeEnvironment
): Promise<ChildProcessWithoutNullStreams | null> {
  const { forking } = hre.network.config as HardhatNetworkConfig;
  if (!forking) {
    logError("Fork configuration is not specified");
    return null;
  }

  // Don't spawn the node if the fork is not needed ("undefined" is considered "true").
  if (forking.enabled == false) {
    logError("Fork is disabled");
    return null;
  }

  const processOptions = ["hardhat", "node", "--no-deploy"];

  const childProcess = spawn("yarn", processOptions);

  // We should kill the node process when the main process has been stopped.
  process.on("exit", function () {
    const { pid } = childProcess;
    pid !== undefined && killProcess(pid);
  });

  // Sometimes the process is still running after the main process has been closed with "CTRL + C".
  const cleanExit = function () {
    process.exit();
  };
  process.on("SIGINT", cleanExit);
  process.on("SIGTERM", cleanExit);

  let errorReason: ErrorReason | null = null;
  let isNodeStarted: boolean = false;

  return new Promise<ChildProcessWithoutNullStreams | null>(
    (resolve, reject) => {
      childProcess.stdout.on("data", (data) => {
        const message = data.toString();

        // Once node is started, we write logs to debug, to hide "eth_*" calls in the console.
        isNodeStarted ? logDebug(message) : log(message);

        // If we get this message, it means that the RPC server is running.
        if (message.includes("Started HTTP and WebSocket JSON-RPC server")) {
          isNodeStarted = true;
          resolve(childProcess);
        }
      });

      childProcess.stderr.on("data", (data) => {
        const message = data.toString();

        // Sometimes node is failing with "Resource is not available" error,
        // In this case we should catch this exception and try to run the node again.
        if (
          message.includes("the resource") &&
          message.includes("is not available")
        ) {
          errorReason = ErrorReason.RESOURCE_NOT_AVAILABLE;
        }

        logError(message);
      });

      childProcess.on("exit", (code) => {
        log(`Node stopped with code: ${code ?? -1}`);

        if (code === 0) {
          resolve(null);
          return;
        }

        reject(<CustomError>{
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

function isCustomError(error: any): error is CustomError {
  return "reason" in error;
}
