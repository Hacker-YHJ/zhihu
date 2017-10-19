const {
  Promise, request, url, _, QUERY,
} = require('../config/commonModules');

const API = require('../config/api');
const User = require('./User');


function getRealUrl(apiUrl, postUrl) {
  const { pathname } = url.parse(postUrl);
  const paths = pathname.split('/');
  if (paths.length < 0) {
    throw new Error('Url error!');
  }

  const data = {
    name: paths[1],
    postID: paths[2],
  };
  return _.template(apiUrl)(data);
}

const getLikers = (postUrl, config) => {
  const query = config || QUERY.zhuanlan.likers;
  const data = {
    url: getRealUrl(API.post.likers, postUrl),
    qs: {
      limit: query.limit,
      offset: query.offset,
    },
  };
  return request(data).then((content) => {
    const users = content.body;
    return JSON.parse(users);
  });
};
/**
 * get full userinfo who stared post
 * @param postUrl post's url
 * @param config
 * @returns {*}  User Object contain detail userinfo , number of question, number of answer etc
 */
const likersDetail = (postUrl, config) => getLikers(postUrl, config).then(users => (
  Promise.map(users, user =>
    // User.getUserByName参数是用户的slug值，不是直接的用户名
    User.getUserByName(user.slug).then(result => result), {
    concurrency: 30,
  }).then(data => _.sortBy(data, 'follower').reverse())
));

const articleInfo = (postUrl) => {
  const options = {
    url: getRealUrl(API.post.info, postUrl),
    gzip: true,
  };

  return request(options).then(content => JSON.parse(content.body));
};

const articleList = (name, config) => {
  const query = config || QUERY.zhuanlan.articleList;
  const data = {
    url: _.template(API.post.page)({ name }),
    qs: {
      limit: query.limit,
      offset: query.offset,
    },
  };
  return request(data).then(content => JSON.parse(content.body));
};

const zhuanlanInfo = (zhuanlanName) => {
  const options = {
    url: API.post.zhuanlan + zhuanlanName,
    gzip: true,
  };
  return request(options).then(content => JSON.parse(content.body));
};


const comments = (postUrl, config) => {
  const query = config || QUERY.zhuanlan.comments;

  const options = {
    url: getRealUrl(API.post.comments, postUrl),
    qs: {
      limit: query.limit,
      offset: query.offset,
    },
  };
  return request(options).then(content => JSON.parse(content.body));
};


module.exports = {
  likersDetail,
  comments,
  info: articleInfo,
  page: articleList,
  zhuanlanInfo,
};
