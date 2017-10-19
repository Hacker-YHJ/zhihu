const zhuanlan = require('./Post');
const User = require('./User');
const Collection = require('./Collection');
const Topic = require('./Topic');
const Answer = require('./Answer');
const Question = require('./Question');

module.exports = {
  Post: zhuanlan,
  User,
  Topic,
  Collection,
  Answer,
  Question,
};
