var chai = require('chai');
var { expect } = chai;
chai.use(require('chai-as-promised'))

var { util } = require('../lib/db');

describe('Types', () => {
  it('should throw TypeError when ensureProperties gets non Array', () => {
    expect(util.ensureProperties({})).to.be.rejectedWith(TypeError);
    expect(util.ensureProperties({}, {})).to.be.rejectedWith(TypeError);
    expect(util.ensureProperties({}, null)).to.be.rejectedWith(TypeError);
    expect(util.ensureProperties({}, undefined)).to.be.rejectedWith(TypeError);
    expect(util.ensureProperties({}, 1)).to.be.rejectedWith(TypeError);
    expect(util.ensureProperties({}, '1')).to.be.rejectedWith(TypeError);
  });
});
