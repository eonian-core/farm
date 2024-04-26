import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { task } from 'hardhat/config'

const errorFilePath = path.join('.errors', 'deploy.json')

task('deploy', async (_args, hre, runSuper) => {
  if (process.env.CI !== 'true') {
    return runSuper(_args)
  }

  console.log('CI env is detected. All exceptions will be saved to the error file!')
  await deleteErrorFile()
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await runSuper(_args)
  }
  catch (e) {
    console.log(`Got an error: "${String(e).substring(0, 64)}...", going to save it to the error file...`)
    await writeErrorFile(e)
  }
})

task('check-deploy-error', async () => {
  const error = await getError()
  if (error) {
    throw new Error(error)
  }
  console.log('Deployment was successful, no errors were thrown')
})

async function writeErrorFile(error: unknown) {
  try {
    await fs.access(errorFilePath, fs.constants.F_OK)
  }
  catch (e) {
    if (!String(e).includes('ENOENT')) {
      throw e
    }
    await fs.mkdir(path.dirname(errorFilePath), { recursive: true })

    const data = JSON.stringify({ date: new Date().toISOString(), error: getErrorMessage(error) }, null, 2)
    await fs.writeFile(errorFilePath, data, { encoding: 'utf-8' })
  }
}

async function getError(): Promise<string | null> {
  try {
    const content = await fs.readFile(errorFilePath, { encoding: 'utf-8' })
    const data = JSON.parse(content) as { error: string }
    return data.error
  }
  catch (e) {
    if (!String(e).includes('ENOENT')) {
      throw e
    }
    return null
  }
}

export async function deleteErrorFile() {
  await fs.rm(dirname(errorFilePath), { recursive: true, force: true })
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
