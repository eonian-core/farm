module.exports = {
  '*.(ts|tsx)': (filenames) => {
    return filenames.length > 10 ? 'eslint . --ext .ts,.tsx --fix' : `eslint ${filenames.join(' ')} --fix`;
  },
  '*.sol': (filenames) => {
    filenames = filenames.map((name) => `"${name}"`).join(' ')
    return [`node ./check-license ${filenames}`, `solhint ${filenames} --formatter stylish --fix`];
  }
};
