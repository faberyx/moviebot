var AWS = require('aws-sdk');
var client = new AWS.SecretsManager({
  region: 'us-east-1'
});

module.exports = () => {
  return new Promise((success, reject) => {
    client.getSecretValue({ SecretId: process.env.DB_KEY }, function (err, data) {
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
