// TODO: migrate this file to @eonian/upgradable 
const { resolve } = require('node:path')
const { readdir, readFile } = require('node:fs').promises

const dir = 'src'
const ext = '.sol'
// SMART_CONTRACTS_LICENSE_TYPE also used in @eonian/upgradable library
const license = process.env.SMART_CONTRACTS_LICENSE_TYPE || 'GNU AGPLv3'
const requiredFirstLine = `// SPDX-License-Identifier: ${license}`

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        return getFiles(res)
      }
      return !res.endsWith(ext) ? undefined : res
    }),
  )
  return Array.prototype.concat(...files).filter(Boolean)
}

async function getFirstLine(filePath) {
  const fileContent = await readFile(filePath, 'utf-8')
  return (fileContent.match(/(^.*)/) || [])[1] || ''
}

async function check(files) {
  files ||= await getFiles(dir)
  for (const file of files) {
    const firstLine = await getFirstLine(file)
    if (firstLine === requiredFirstLine) {
      continue
    }
    throw new Error(`Wrong license for file: ${file}`)
  }
}

async function main() {
  const files = process.argv.slice(2)
  await check(files.length > 0 ? files : undefined)
}

main()
