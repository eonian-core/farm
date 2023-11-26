/* eslint-disable no-console */
const { exec } = require('node:child_process')

const VARS = {
  COMMIT: process.env.VERCEL_GIT_COMMIT_SHA,
  COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE,
  LOGROCKET_API_KEY: process.env.LOGROCKET_API_KEY,
  ENV_NAME: process.env.VERCEL_ENV,
  BRANCH_NAME: process.env.VERCEL_GIT_COMMIT_REF,
}

const BUILD_PATH = '.next/static/chunks'
const URL_PREFIX = '~/_next/static/chunks/'

/**
 * Performs all steps of LogRocket release.
 */
async function releaseLogRocket() {
  try {
    console.log('Performing LogRocket release...')

    printVariables()

    const performRelease = isReleaseRequired()
    if (!performRelease) {
      console.log('LogRocket release is skipped')
      return
    }

    const hasMaps = await hasSourceMaps()
    if (!hasMaps) {
      console.log('LogRocket release is skipped, no source maps found')
      return
    }

    /**
     * Create LogRocket release.
     */
    await asyncExec(
      `yarn logrocket release ${VARS.COMMIT} --apikey="${VARS.LOGROCKET_API_KEY}"`,
    )

    /**
     * Upload source code to LogRocket platform.
     */
    await asyncExec(
      `logrocket upload ${BUILD_PATH} -r ${VARS.COMMIT} --apikey="${VARS.LOGROCKET_API_KEY}" --url-prefix="${URL_PREFIX}"`,
    )

    /**
     * Remove source map (*.map files) from the build.
     */
    await asyncExec(`find ./${BUILD_PATH} -name '*.map' -delete`)

    /**
     * Clear links to the source maps from the source code.
     */
    await asyncExec(
      `find ./${BUILD_PATH} -regex '.*.\(js\|css\)' -exec sed -i -E '/^\/\/# sourceMappingURL.*/d' {} +`,
    )
  }
  catch (e) {
    console.error(`Error while releasing LogRocket: ${e}`)
  }
}

/**
 * Make LogRocket release only on production/staging/development builds (or if the commit message has "logrocket" substring).
 */
function isReleaseRequired() {
  return (
    VARS.ENV_NAME !== 'preview'
    || VARS.BRANCH_NAME.toLowerCase() === 'staging'
    || VARS.COMMIT_MESSAGE.toLowerCase().includes('logrocket')
  )
}

/**
 * Prints all required env. variables.
 */
function printVariables() {
  Object.keys(VARS).forEach((key) => {
    const value = VARS[key]
    if (!value) {
      throw new Error(`Variable "${key}" is not defined`)
    }
    if (key === 'LOGROCKET_API_KEY') {
      console.log(`\t[${key}: ${value?.split(':')?.[1]}]`)
      return
    }
    console.log(`\t[${key}: ${value}]`)
  })
}

/**
 * Returns count of the source maps in the build directory.
 */
async function hasSourceMaps() {
  const { stdout: count } = await asyncExec(
    `find ./${BUILD_PATH} -name '*.map' | wc -l`,
    { silent: true },
  )
  return Number.parseInt(count) > 0
}

function asyncExec(command, params = {}) {
  console.log(`Executing: ${command}`)
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }
      if (!params.silent) {
        console.log(stdout, stderr)
      }
      resolve({ stdout, stderr })
    })
  })
}

releaseLogRocket()
