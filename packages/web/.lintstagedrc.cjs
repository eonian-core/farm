module.exports = {
  '*.(ts|tsx)': (filenames) => {
    return filenames.length > 5 ? 'eslint . --ext .ts,.tsx --fix' : `eslint ${filenames.join(' ')} --fix`;
  },
};
