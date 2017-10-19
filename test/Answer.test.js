/* eslint-disable no-unused-expressions */

const { Answer } = require('../index');
const chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

describe('Answer', () => {
  describe('Voters', () => {
    it('should return voters of the answer', () => {
      const answerId = '35369006';
      Answer.voters(answerId).should.eventually.not.be.empty;
    });
  });
});
