/* eslint-disable sonarjs/cognitive-complexity */
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { spawn } from 'node:child_process'
import debug from 'debug'
import kill from 'tree-kill'
import { task } from 'hardhat/config'
import { TASK_TEST } from 'hardhat/builtin-tasks/task-names'
import type { HardhatNetworkConfig, HardhatRuntimeEnvironment, HttpNetworkConfig, RunSuperFunction } from 'hardhat/types'
import { Chain, getChainForFork } from '../types'

enum ErrorReason {
  RESOURCE_NOT_AVAILABLE = 'RESOURCE_NOT_AVAILABLE',
  OTHER = 'OTHER',
}

interface CustomError {
  reason: ErrorReason
  code: number | null
  message: string | null
}

// Add "DEBUG" env. variable with "start-hardhat-node*" to see the logs from this file.
const log = debug('start-hardhat-node')
const logError = log.extend('error')
const logDebug = log.extend('debug')

const MAX_RESTART_ATTEMPTS = 30

/**
 * Starts the node on hardhat "test" command (only if the name of the current network is "hardhat").
 * Kills the RPC server process once all the tests are done.
 */
export const startNodeTask = task(TASK_TEST, async (_args, env, runSuper) => {
  if (env.network.name !== 'hardhat') {
    log('Current network is not "hardhat", fork node will not be started')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await runSuper()
  }
  if (getChainForFork() === Chain.UNKNOWN) {
    log('No fork chain selected, node will not be started')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await runSuper()
  }
  await runTask(env, runSuper)
})

task('run-fork-server')
  .addParam('time', 'Represents the time in minutes, indicating how long the server will be active')
  .setAction(async (_args, env) => {
    if (env.network.name !== 'hardhat') {
      log('Current network is not "hardhat", fork node will not be started')
      return
    }
    const childProcess = await startNode(env)
    if (childProcess) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { time = '10' } = _args ?? {}
      const { url } = env.network.config as HttpNetworkConfig
      console.log(`Node is up and running on ${url ?? 'http://127.0.0.1:8545'}! TTL is ${time} minutes.`)

      await new Promise(resolve => setTimeout(resolve, +time * 60 * 1000))

      const { pid } = childProcess
      if (pid) {
        console.log(`Stopping node (PID: ${pid})...`)
        await killProcess(pid)
      }
    }
  })

async function runTask(env: HardhatRuntimeEnvironment, runSuper: RunSuperFunction<unknown>, attempt = 0) {
  try {
    console.log(`Starting node... ${attempt ? `Attempt: ${attempt + 1}` : ''}`.trim())
    const childProcess = await startNode(env)
    const { url } = env.network.config as HttpNetworkConfig
    console.log(`Node is up and running on ${url ?? 'http://127.0.0.1:8545'}!`)

    await runSuper()

    const { pid } = childProcess
    if (pid) {
      console.log(`Stopping node (PID: ${pid})...`)
      await killProcess(pid)
    }
  }
  catch (error: unknown) {
    // Retry to start if there was a network error.
    if (isCustomError(error) && error.reason === ErrorReason.RESOURCE_NOT_AVAILABLE) {
      if (++attempt >= MAX_RESTART_ATTEMPTS) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw error
      }
      await runTask(env, runSuper, attempt)
      return
    }
    throw error
  }
}

/**
 * Starts the RPC server by executing yarn command.
 * @param hre Hardhat runtime environment (configuration)
 * @returns Spawned child process of the RPC server
 */
async function startNode(hre: HardhatRuntimeEnvironment): Promise<ChildProcessWithoutNullStreams> {
  const { forking } = hre.network.config as HardhatNetworkConfig
  if (!forking) {
    throw new Error('Fork configuration is not specified!')
  }

  // Don't spawn the node if the fork is not needed ("undefined" is considered "true").
  if (forking.enabled === false) {
    throw new Error('Fork is disabled')
  }

  const childProcess = spawn('yarn', ['hardhat', 'node'])

  // We should kill the node process when the main process has been stopped.
  process.on('exit', () => {
    const { pid } = childProcess
    void (pid !== undefined && killProcess(pid))
  })

  // Sometimes the process is still running after the main process has been closed with "CTRL + C".
  const cleanExit = function () {
    process.exit()
  }
  process.on('SIGINT', cleanExit)
  process.on('SIGTERM', cleanExit)

  let errorReason: ErrorReason | null = null
  let errorMessage: string | null = null
  let isNodeStarted: boolean = false

  return new Promise<ChildProcessWithoutNullStreams>((resolve, reject) => {
    childProcess.stdout.on('data', (data: object) => {
      const message = data.toString()

      // Once node is started, we write logs to debug, to hide "eth_*" calls in the console.
      isNodeStarted ? logDebug(message) : log(message)

      // If we get this message, it means that the RPC server is running.
      if (message.includes('Started HTTP and WebSocket JSON-RPC server')) {
        isNodeStarted = true
        resolve(childProcess)
      }
    })

    childProcess.stderr.on('data', (data: object) => {
      const message = data.toString()

      errorMessage = errorMessage ?? ''
      errorMessage += message

      // Sometimes node is failing with "Resource is not available" error,
      // In this case we should catch this exception and try to run the node again.
      if (message.includes('the resource') && message.includes('is not available')) {
        errorReason = ErrorReason.RESOURCE_NOT_AVAILABLE
      }

      logError(message)
    })

    childProcess.on('exit', (code) => {
      log(`Node stopped with code: ${code ?? -1}`)

      if (code === 0) {
        resolve(childProcess)
        return
      }

      // eslint-disable-next-line prefer-promise-reject-errors
      reject(<CustomError>{
        reason: errorReason ?? ErrorReason.OTHER,
        code: resolveErrorCode(errorReason) ?? code,
        message: errorMessage,
      })
    })

    childProcess.on('error', reject)
  })
}

/**
 * Kills the specified process.
 * In our case we use the "tree-kill" package because yarn command
 * spawns child processes and we need to get rid of the whole tree.
 */
function killProcess(pid: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    kill(pid, (error) => {
      error ? reject(error) : resolve()
    })
  })
}

function resolveErrorCode(errorReason: ErrorReason | null): number | null {
  switch (errorReason) {
    case ErrorReason.RESOURCE_NOT_AVAILABLE:
      return -32002
    default:
      return null
  }
}

function isCustomError(error: any): error is CustomError {
  return 'reason' in error
}
