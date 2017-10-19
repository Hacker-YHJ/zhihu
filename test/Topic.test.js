/* eslint-disable no-unused-expressions */
const { Topic } = require('../');
const chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

describe('Topic', () => {
  describe('#info', () => {
    it('should return topic info object', () => {
      const topicID = '19550461';

      // http://www.zhihu.com/topic/19550461/questions
      // if page? http://www.zhihu.com/topic/19550461/questions?page=2

      Topic.getTopicTopAnswersByID(topicID).should.eventually.be.not.empty;
    });
  });
});
