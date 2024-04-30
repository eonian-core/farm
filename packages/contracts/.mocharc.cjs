const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

process.env.TS_NODE_TRANSPILE_ONLY = 1 

module.exports = {
  extension: ['ts'],
  require: ['ts-node/register', 'source-map-support/register'],
  recursive: true,
};
