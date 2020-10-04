// @ts-nocheck
// @ts-ignore
const AWS = require('aws-sdk');

// --------------- REST  API  Services  -----------------------
const svc = new AWS.Service({
  endpoint: `https://moviebot.cognitiveservices.azure.com`,
  region: 'us-east-1',
  convertResponseTypes: false,
  // @ts-ignore
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

const getSpellCheck = (text) => {
  return new Promise((resolve, reject) => {
    svc.getSpellCheck(
      {
        text,
        key: ''
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

/**
 * Checks for eventual spelling errors of the user
 * @param {string} text
 */
// eslint-disable-next-line no-unused-expressions
(async function () {
  let t = 'an horror movie with Brad Pitt';
  const k = await getSpellCheck(t);

  console.log(k);
})();
