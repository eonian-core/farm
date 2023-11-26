module.exports = {
  '*.(ts|tsx)': (filenames) => {
    return filenames.length > 10 ? 'eslint . --ext .ts,.tsx,.js,.cjs,.jsx --fix' : `eslint ${filenames.join(' ')} --fix`;
  },
};
