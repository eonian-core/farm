const { check } = require('./check-license');

module.exports = {
  '*.(ts|tsx)': (filenames) => {
    return filenames.length > 5 ? 'eslint . --ext .ts,.tsx --fix' : `eslint ${filenames.join(' ')} --fix`;
  },
  '*.sol': (filenames) => {
    return `node -e 'require(\"./check-license\").check([${filenames.join()}])'`;
  }
};
