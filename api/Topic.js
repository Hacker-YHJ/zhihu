const { request, cheerio } = require('../config/commonModules');

const API = require('../config/api');

const getTopicByID = (topicID, page = 1) => {
  const data = {
    url: `${API.topic_url + topicID}/questions`,
    qs: {
      page,
    },
  };

  return request(data).then((content) => {
    const responseBody = content.body;
    const $ = cheerio.load(responseBody);
    const result = {
      name: $('.topic-info .topic-name h1').text(),
    };

    const questions = {};

    $('div.feed-item.feed-item-hook.question-item').each((i, elem) => {
      questions[i] = {};
      questions[i].title = $('a.question_link', elem).text();
      questions[i].url = API.zhihu +
        $('a.question_link', elem).attr('href');
      questions[i].postTime = $('span.time', elem).text();
    });

    result.page = page;
    result.totalpage = Number($('div.zm-invite-pager span').last().prev().text());
    result.questions = questions;
    return result;
  });
};

const getTopicTopAnswersByID = (topicID, page = 1) => {
  const data = {
    url: `${API.topic_url + topicID}/top-answers`,
    qs: {
      page,
    },
  };
  return request(data).then((content) => {
    const responseBody = content.body;
    const $ = cheerio.load(responseBody);
    const result = {
      name: $('.topic-info .topic-name h1').text(),
    };

    const questions = {};

    $('div.feed-item.feed-item-hook.folding').each((i, elem) => {
      questions[i] = {};
      questions[i].title = $('a.question_link', elem).text();
      questions[i].url = API.zhihu + $('a.question_link', elem).attr('href');
      questions[i].upvotes = $('a.zm-item-vote-count', elem).text();
      [questions[i].comment_count] = $('a.toggle-comment', elem).last().text().match(/\d+/g);
      questions[i].answer_url = API.zhihu + $('a.toggle-expand', elem).attr('href');
      questions[i].user = {};
      questions[i].user.name = $('h3.zm-item-answer-author-wrap a', elem).text();
      questions[i].user.url = API.zhihu
        + $('h3.zm-item-answer-author-wrap a', elem).attr('href');
    });

    result.page = page;
    result.totalpage = Number($('div.zm-invite-pager span').last().prev().text());
    result.questions = questions;
    return result;
  });
};

module.exports = {
  getTopicByID,
  getTopicTopAnswersByID,
};
