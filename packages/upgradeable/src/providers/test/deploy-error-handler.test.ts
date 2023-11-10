import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployErrorHandler } from '../deploy-error-handler'

describe('deploy-error-handler', () => {
  const manifestFolder = path.resolve(os.tmpdir(), '__test')
  const hre = {
    config: {
      paths: {
        deployments: manifestFolder,
      },
    },
    network: { name: 'test' },
  } as unknown as HardhatRuntimeEnvironment
  const handler = new DeployErrorHandler(hre)

  beforeAll(async () => {
    try {
      await fs.promises.rm(manifestFolder, { force: true, recursive: true })
      await fs.promises.mkdir(manifestFolder)
    }
    catch (e) {}
  })

  afterEach(async () => {
    try {
      await fs.promises.unlink(handler.filePath)
    }
    catch (e) {}
  })

  it('Should create empty error manifest file', async () => {
    await handler.createErrorManifestFile()

    const content = await fs.promises.readFile(handler.filePath, 'utf8')
    expect(content).toBe('{}')
  })

  it('Should remove error manifest file', async () => {
    await handler.createErrorManifestFile()

    expect(await checkFileExists(handler.filePath)).toBe(true)

    expect(await handler.removeErrorManifestFile()).toBe(true)

    expect(await checkFileExists(handler.filePath)).toBe(false)
  })

  it('Should save error to manifest', async () => {
    await handler.createErrorManifestFile()

    await handler.handleDeployError(new Error('Error A'), 'DeploymentA')
    await handler.handleDeployError(new Error('Error B'), 'DeploymentB')

    const content = await fs.promises.readFile(handler.filePath, 'utf8')
    expect(JSON.parse(content)).toEqual({
      DeploymentA: 'Error A',
      DeploymentB: 'Error B',
    })
  })

  it('Should throw if manifest contains errors', async () => {
    await handler.createErrorManifestFile()

    await handler.handleDeployError(new Error('Error A'), 'DeploymentA')
    await handler.handleDeployError(new Error('Error B'), 'DeploymentB')

    const expectedErrors = {
      DeploymentA: 'Error A',
      DeploymentB: 'Error B',
    }
    await expect(() => handler.checkDeployResult()).rejects.toEqual(
      new Error(`Deploy was unsuccesful, 2 error(s) occured:\n ${JSON.stringify(expectedErrors, null, 2)}`),
    )
  })

  it('Should not throw if manifest does not contain errors', async () => {
    await handler.createErrorManifestFile()

    await handler.checkDeployResult()

    expect(true).toBeTruthy()
  })
})

async function checkFileExists(file: string) {
  try {
    await fs.promises.access(file, fs.constants.F_OK)
    return true
  }
  catch {
    return false
  }
}
