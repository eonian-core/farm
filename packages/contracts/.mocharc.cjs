const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

module.exports = {
  extension: ['ts'],
  require: ['ts-node/register', 'source-map-support/register'],
  recursive: true,
};
