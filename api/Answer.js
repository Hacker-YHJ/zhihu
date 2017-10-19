const { cheerio, request, _ } = require('../config/commonModules');

const config = require('../config/api');
// const User = require('./User');

const renderUrl = answerId => _.template(config.answer.voters)({ answerId });

/*
 * @param answerId  Different from the string after "answer" in url,
 *                  the real answerId is not that obvious. For example,
 *                  "/question/28207685/answer/39974928",
 *                  the answerId of this post is "11382008" instead.
 */
const voters = (answerId) => {
  const url = renderUrl(answerId);
  const options = {
    url,
  };

  return request(options).then((res) => {
    const buffer = JSON.parse(res.body);
    let votersArr = [];

    if (Array.isArray(buffer.payload)) {
      votersArr = buffer.payload.map((payload) => {
        const $ = cheerio.load(payload);
        const user = {};

        const anchor = $('a[title]');
        const status = $('ul.status > li').children('a, span');
        user.name = anchor.attr('title');

        user.anonymous = !user.name;

        if (!user.anonymous) {
          user.profileUrl = anchor.attr('href');
          user.sex = ((str) => {
            switch (str) {
              case '他':
                return 'male';
              case '她':
                return 'female';
              default:
                return undefined;
            }
          })($('.zg-btn-follow').text().slice(2));
        } else {
          user.name = '匿名用户';
        }

        user.avatar = $('.zm-item-img-avatar').attr('src');
        user.like = parseInt(status.eq(0).text(), 10);
        user.thank = parseInt(status.eq(1).text(), 10);
        user.question = ((el) => {
          const href = el.attr('href');
          if (href) {
            this.questionUrl = href;
          }
          return parseInt(el.text(), 10);
        }).call(user, status.eq(2));
        user.answer = ((el) => {
          const href = el.attr('href');
          if (href) {
            this.answerUrl = href;
          }
          return parseInt(el.text(), 10);
        }).call(user, status.eq(3));

        return user;
      });
    }
    return votersArr;
  });
};

module.exports = {
  voters,
};
