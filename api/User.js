const { request, cheerio } = require('../config/commonModules');
const config = require('../config');
const API = require('../config/api');


function formatFollowData(str) {
  if (str.indexOf('K') !== -1) {
    return parseInt(str, 10) * 1000;
  }
  // if (str.indexOf('K') !== -1) {
  //   return parseInt(str) * 10000;
  // }
  return parseInt(str, 10);
}

/*
 * @param name  The name of Zhihu user
 * @return      A promise
 */
const info = (name) => {
  const data = {
    url: API.user.info,
    qs: {
      params: JSON.stringify({
        url_token: name,
      }),
    },
  };

  return request(data).then((content) => {
    const responseBody = content.body;
    const $ = cheerio.load(responseBody);
    const values = $('span.value');
    const result = {
      answer: formatFollowData(values.eq(0).text()),
      post: formatFollowData(values.eq(1).text()),
      follower: formatFollowData(values.eq(2).text()),
    };
    result.profileUrl = config.zhihu + $('a.avatar-link').attr('href');
    result.name = $('span.name').text();
    const male = $('.icon-profile-female');
    result.sex = male.length === 1 ? 'female' : 'male';
    return result;
  });
};

const questions = () => {
};

const answers = () => {
};

const zhuanlansFocus = () => {
};

const topic = () => {
};

module.exports = {
  info,
  // TODO
  zhuanlansFocus,
  questions,
  answers,
  topic,

  // Deprecated
  getUserByName: info,
};
