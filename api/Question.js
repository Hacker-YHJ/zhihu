const { request, cheerio } = require('../config/commonModules');

const answers = (rawParams, offset) => {
  let params = rawParams;
  if (typeof rawParams === 'string') {
    params = {
      token: rawParams,
      offset: offset || 0,
      // pagesize: arguments[2] || 10,
    };
  }

  const opt = {
    uri: 'https://www.zhihu.com/node/QuestionAnswerListV2',
    form: {
      method: 'next',
      params: JSON.stringify({
        url_token: params.token,
        pagesize: params.pagesize,
        offset: 0, // params.offset,
      }),
    },
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
      Referer: `https://www.zhihu.com/question/${params.token}`,
    },
  };

  return request(opt)
    .then((response) => {
      let ret;
      let data;
      try {
        data = JSON.parse(response.body);
      } catch (e) {
        data = null;
      }
      if (data && Array.isArray(data.msg)) {
        ret = data.msg.map((payload) => {
          const $ = cheerio.load(payload, {
            decodeEntities: false,
          });

          const author = $('.zm-item-answer-author-info');
          const authorAnchor = author.find('.author-link');
          const voters = $('span.voters a');
          const content = $('.zm-editable-content');
          const ans = {};

          if (authorAnchor.length) {
            ans.author = {
              name: authorAnchor.text(),
              profileUrl: authorAnchor.attr('href'),
              bio: author.find('span[title]').attr('title'),
              avatar: author.find('img').attr('src'),
            };
          } else {
            ans.author = {
              name: '匿名用户',
            };
          }

          ans.voters = voters.length ? parseInt(voters.text(), 10) : 0;
          ans.text = content.text();
          ans.html = content.html();

          return ans;
        });
      }
      return ret;
    });
};

module.exports = {
  answers,
};
