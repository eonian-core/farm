const { existsSync, lstatSync, symlink } = require('node:fs')
const { dirname, join, resolve } = require('node:path')

const symlinkPath = join(findHardhatProjectRoot(), 'node_modules')
const targetPath = findMonorepoRootNodeModules()

/**
 * There is no 'nohoist' option in npm workspaces configuration,
 * but Hardhat requires to have modules installed in the project directory,
 * so we can create a symlink to the monorepo's root node_modules to fix the issue.
 * RFCS is online for several years, but still nothing: https://github.com/npm/rfcs/issues/287.
 */
symlink(targetPath, symlinkPath, 'dir', (error) => {
  if (error) {
    console.error('Failed to create symlink!', error)
  }
  else {
    console.log('Symlink to root "node_modules" created successfully!')
  }
})

function findHardhatProjectRoot(startPath = __dirname) {
  let currentDir = resolve(startPath)
  while (currentDir) {
    const configPath = join(currentDir, 'hardhat.config.ts')
    if (existsSync(configPath)) {
      return currentDir
    }
    const parentDir = dirname(currentDir)
    if (currentDir === parentDir) {
      break
    }
    currentDir = parentDir
  }
  return null
}

function findMonorepoRootNodeModules(startPath = __dirname) {
  let currentDir = resolve(startPath)
  while (currentDir) {
    const nodeModulesPath = join(currentDir, 'node_modules')
    if (existsSync(nodeModulesPath)) {
      const stats = lstatSync(nodeModulesPath)
      if (stats.isDirectory() && !stats.isSymbolicLink()) {
        return nodeModulesPath
      }
    }
    const parentDir = dirname(currentDir)
    if (currentDir === parentDir) {
      break
    }
    currentDir = parentDir
  }
  return null
}
