var AWS = require('aws-sdk');
var client = new AWS.SecretsManager({
  region: 'us-east-1'
});

/**
 * Retrieves secret values from AWS Secret Manager
 * @param {string} Secret Key to retrieve
 */
const getSecret = (value) => {
  return new Promise((success, reject) => {
    client.getSecretValue({ SecretId: value }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        if ('SecretString' in data) {
          success(data.SecretString);
        } else {
          let buff = new Buffer(data.SecretBinary, 'base64');
          const decodedBinarySecret = buff.toString('ascii');
          success(decodedBinarySecret);
        }
      }
    });
  });
};

/**
 * Retrieve RDS DB Connenction string
 */
module.exports.getDBConnection = async () => {
  return JSON.parse(await getSecret(process.env.DB_KEY));
};

/**
 * Retrieve RDS DB Connenction string
 */
module.exports.getSpellCheckKey = async () => {
  return JSON.parse(await getSecret(process.env.SPELLCHECK_KEY)).key;
};
