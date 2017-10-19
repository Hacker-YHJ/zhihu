/* eslint-disable no-unused-expressions */
const { Post } = require('../');
const chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

describe('Post', () => {
  describe('#info', () => {
    it('should return post info object', () => {
      const postUrl = 'https://zhuanlan.zhihu.com/p/19888522';
      Post.info(postUrl).should.eventually.be.not.empty;
    });
  });

  describe('#zhuanlan', () => {
    it('should return zhuanlan info object', () => {
      const name = 'bigertech';
      Post.zhuanlanInfo(name).should.eventually.be.not.empty;
    });
  });
  describe('#comments', () => {
    it('should return zhuanlan article comments array', () => {
      const postUrl = 'https://zhuanlan.zhihu.com/p/19888522';
      Post.comments(postUrl).should.eventually.be.not.empty;
    });
  });
});
