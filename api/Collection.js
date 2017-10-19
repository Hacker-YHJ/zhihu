const {
  cheerio, request, Promise, url,
} = require('../config/commonModules');

const config = require('../config');
const API = require('../config/api');

function getItems(body) {
  const $ = cheerio.load(body);
  const allZMItem = $('.zm-item');
  const items = [];
  allZMItem.each((index, element) => {
    const h2 = $(element).find('h2.zm-item-title a');
    const href = h2.attr('href') || '';
    const content = $(element).find('div.zm-item-fav div');
    const user = content.find('.answer-head .zm-item-answer-author-wrap');
    const answerID = parseInt($(element).find('.zm-item-fav .zm-item-answer ').attr('data-aid'), 10);
    const atoken = parseInt($(element).find('.zm-item-fav .zm-item-answer ').attr('data-atoken'), 10);
    const html = $(element).find('textarea.content').html();
    const item = {
      aid: answerID,
      voter: parseInt($(element).find('.zm-item-vote a.zm-item-vote-count').text(), 10),
      desc: content.find('div.zh-summary.summary').text(),
      content: html,
      atoken,
      question: {
        id: parseInt(href.match(/\d*?$/)[0], 10),
        title: h2.text(),
        url: config.zhihu + h2.attr('href'),
      },
      user: {
        username: user.find('a').text(),
        userTitle: user.find('strong').text(),
        url: user.find('a').attr('href'),
      },
    };
    items.push(item);
  });

  return items;
}

/**
 * 获取某一页的数据
 * @param url
 * @returns {*}
 */
function getDataByPage(pageUrl) {
  if (url.indexOf(API.collection.url) < 0) {
    throw new Error('Url not match!');
  }

  const options = {
    url: pageUrl,
    headers: config.headers,
  };
  return request(options).then(body => getItems(body.body));
}

/**
 * 获取分页信息
 * @param url
 * @returns {*}
 */
function getPagination(pageUrl) {
  const options = {
    url: pageUrl,
    headers: config.headers,
  };
  return request(options).then((body) => {
    const $ = cheerio.load(body.body);
    const pages = $('.zm-invite-pager span').eq(-2).text();
    const currentPage = $('.zm-invite-pager span.zg-gray-normal').eq(-1).text();
    return {
      pages: parseInt(pages, 10),
      current: parseInt(currentPage, 10),
    };
  });
}

/**
 * 获取所有页的数据，
 * 先查询分页，然后查询每一页的数据
 * @param url
 * @returns {*}
 */
function getAllPageData(pageUrl) {
  const formatUrl = url.parse(pageUrl);
  const realUrl = config.zhihu + formatUrl.pathname;
  let allItems = [];
  return getPagination(url).then(paginations => (
    Promise.map(Array(...paginations.pages), (_, page) => {
      const singlePageUrl = `${realUrl}?page=${page + 1}`;
      return getDataByPage(singlePageUrl).then((items) => {
        allItems = allItems.concat(items);
      });
    }, { concurrency: 5 }).then(total => total)
  )).then(() => allItems);
}

function getCollectionInfo(pageUrl) {
  if (pageUrl.indexOf(API.collection.url) < 0) {
    throw new Error('Url not match!');
  }

  const cid = parseInt(pageUrl.match(/\d+/)[0], 10);
  const options = {
    pageUrl,
    headers: config.headers,
  };
  return request(options).then((body) => {
    const $ = cheerio.load(body[1]);
    const title = $('#zh-fav-head-title').text();
    const $user = $('#zh-single-answer-author-info .zm-list-content-title a');
    const user = {
      img: $('a.zm-list-avatar-link .zm-list-avatar-medium').attr('src'),
      name: $user.text(),
      url: $user.attr('href'),
    };
    return {
      cid,
      title,
      user,
    };
  });
}

module.exports = {
  getAllPageData,
  getDataByPage,
  getPagination,
  getCollectionInfo,
};
