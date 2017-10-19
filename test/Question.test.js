const { Question } = require('../');
const chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

describe('Question', () => {
  it('should return question object by settings', () => Question.answers({
    token: '19557271',
    offset: 0,
    // pagesize: 5
  }).should.eventually.be.not.empty);

  it('should return question object, from 0 - 9 by default', () => Question.answers('19557271').should.eventually.be.not.empty);
});
