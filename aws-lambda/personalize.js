const AWS = require('aws-sdk');

module.exports.getMovies = (userId, genre) => {
  return new Promise((resolve, reject) => {
    var personalizeruntime = new AWS.PersonalizeRuntime();

    var params = {
      campaignArn: 'arn:aws:personalize:us-east-1:921119069545:campaign/campaign_v1',
      userId,
      //  filterArn: 'STRING_VALUE',
      numResults: 3
    };

    personalizeruntime.getRecommendations(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else resolve(data);
    });
  });
};
