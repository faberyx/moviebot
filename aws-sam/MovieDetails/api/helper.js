// @ts-check
/**
 * Payload  returning from the api
 * @param {number} statusCode
 * @param {string} body
 */
module.exports.payload = (statusCode, body) => {
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
