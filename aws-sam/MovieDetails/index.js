// @ts-check
// const AWS = require('aws-sdk');
const query = require('./queryMovie');

/**
 * Payload  returning from the api
 * @param {number} statusCode
 * @param {string} body
 */
const payload = (statusCode, body) => {
  return {
    statusCode,
    body,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
      'Access-Control-Allow-Method': 'GET,POST,OPTIONS'
    }
  };
};

exports.handler = async (event, context) => {
  try {
    const id = event.pathParameters.id;

    if (!id) {
      return payload(404, null);
    }

    let data;

    switch (event.resource) {
      case '/recommended/{id+}':
        data = await query.getRecommended(id);
        break;
      case '/details/{id+}':
        data = await query.getMovie(id);
        break;
      default:
        return payload(404, null);
    }

    return payload(200, JSON.stringify(data));
  } catch (err) {
    return payload(500, err.messasge);
  }
};
