// @ts-check
// const AWS = require('aws-sdk');
const route = require('./routing');
const helper = require('./helper');

exports.handler = async (event, context) => {
  try {
    console.log(event);
    return route.routes(event);
  } catch (err) {
    return helper.payload(500, err.messasge);
  }
};
