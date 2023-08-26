const { resolve } = require('path');
const { readdir, readFile } = require('fs').promises;

const dir = 'src';
const ext = '.sol';
const license = 'AGPL-3.0';
const requiredFirstLine = '// SPDX-License-Identifier: ' + license;

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getFiles(res);
      }
      return !res.endsWith(ext) ? undefined : res;
    })
  );
  return Array.prototype.concat(...files).filter(Boolean);
}

async function getFirstLine(filePath) {
  const fileContent = await readFile(filePath, 'utf-8');
  return (fileContent.match(/(^.*)/) || [])[1] || '';
}

async function check(files) {
  files ||= await getFiles(dir);
  for (const file of files) {
    const firstLine = await getFirstLine(file);
    if (firstLine === requiredFirstLine) {
      continue;
    }
    throw new Error('Wrong license for file: ' + file);
  }
}

async function main() {
  const files = process.argv.slice(2);
  await check(files.length > 0 ? files : undefined);
}

main();
