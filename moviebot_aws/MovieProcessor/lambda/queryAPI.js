// @ts-check
// @ts-ignore
const AWS = require('aws-sdk');
const secret = require('./secretManager');

// --------------- REST  API  Services  -----------------------
const svc = new AWS.Service({
  endpoint: `https://moviebot.cognitiveservices.azure.com`,
  convertResponseTypes: false,
  apiConfig: {
    metadata: {
      protocol: 'rest-json' // API is JSON-based
    },
    operations: {
      getSpellCheck: {
        http: {
          method: 'GET',
          requestUri: '/bing/v7.0/spellcheck'
        },
        input: {
          type: 'structure',
          members: {
            key: {
              location: 'header',
              locationName: 'Ocp-Apim-Subscription-Key'
            },
            text: {
              location: 'querystring',
              locationName: 'text'
            }
          }
        }
      }
    }
  }
});

/**
 * Performs spell check on the provided text
 * @param {string} text
 */
module.exports.getSpellCheck = async (text) => {
  const key = await secret.getSpellCheckKey();
  return new Promise((resolve, reject) => {
    svc.getSpellCheck(
      {
        text,
        key
      },
      (err, data) => {
        if (err) {
          console.error('>>> API Error:', err);
          reject(err);
          return;
        }
        let txt = text;
        if (data && data.flaggedTokens) {
          data.flaggedTokens.forEach((e) => {
            if (e.suggestions && e.suggestions.length > 0) {
              txt = txt.replace(e.token, e.suggestions[0].suggestion);
            }
          });
        }
        resolve({ text: txt, isSpellChecked: text !== txt });
        return;
      }
    );
  });
};
