const { User } = require('../');
const chai = require('chai');

chai.should();
chai.use(require('chai-as-promised'));

const promise1 = User.info('iplus26');
const promise2 = User.info('fenng');
const promise3 = User.info('magie');

describe('User', () => {
  describe('#info', () => {
    it('should return user info object', () =>
      promise1.should.eventually.be.not.empty);

    /*
     fenng
     followed by 293,993 users, following 1891 users up to 24 May, 2016
     */
    it('should return user info object (fenng)', () => promise2.should.eventually.be.not.empty);

    it('should recongize users followed by thousands (fenng)', () => promise2.should.eventually.have.property('follower').that.is.above(1000));

    /*
     magie
     followed by 538,958 users, following 570 users up to 24 May, 2016
     */
    it('should return user info object (magie)', () => promise3.should.eventually.be.not.empty);
    it('should recongize users followed by thousands (magie)', () => promise3.should.eventually.have.property('follower').that.is.above(1000));
  });
});
