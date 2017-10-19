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

    $('div.feed-item.feed-item-hook.question-item').each((i) => {
      questions[i] = {};
      questions[i].title = $('a.question_link', this).text();
      questions[i].url = API.zhihu +
        $('a.question_link', this).attr('href');
      questions[i].postTime = $('span.time', this).text();
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

    $('div.feed-item.feed-item-hook.folding').each((i) => {
      questions[i] = {};
      questions[i].title = $('a.question_link', this).text();
      questions[i].url = API.zhihu + $('a.question_link', this).attr('href');
      questions[i].upvotes = $('a.zm-item-vote-count', this).text();
      [questions[i].comment_count] = $('a.toggle-comment', this).last().text().match(/\d+/g);
      questions[i].answer_url = API.zhihu + $('a.toggle-expand', this).attr('href');
      questions[i].user = {};
      questions[i].user.name = $('h3.zm-item-answer-author-wrap a', this).text();
      questions[i].user.url = API.zhihu
        + $('h3.zm-item-answer-author-wrap a', this).attr('href');
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
