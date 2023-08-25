module.exports = {
  '*.(ts|tsx)': (filenames) =>
    filenames.length > 5 ? 'eslint . --ext .ts,.tsx --fix' : `eslint ${filenames.join(' ')} --fix`,
  '*.json': ['prettier --write'],
};
