const AWS = require('aws-sdk');


// --------------- API  Service  -----------------------
const svc = new AWS.Service({

    endpoint: `https://api.themoviedb.org/3`,
    convertResponseTypes: false,
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // API is JSON-based
        },
        operations: {
            getMovie: {
                http: {
                    method: 'GET',
                    requestUri: '/movie/{movieId}?api_key=adfcb22b23867f298e2c032ea4801456'
                },
                input: {
                    type: 'structure',
                    required: ['movieId'],
                    members: {
                        'movieId': {
                            type: 'integer',
                            // include it in the call URI
                            location: 'uri',
                            // this is the name of the placeholder in the URI
                            locationName: 'movieId'
                        }
                    }
                }
            }
        }
    }
});

module.exports.getApi = (movieId) => {

    return new Promise((resolve, reject) => {
        svc.getMovie({
            movieId,
        }, (err, data) => {
            if (err) {
                console.error('>>> API Error:', err);
                reject(err);
                return;
            }
            resolve(data);
            return;
        });
    });
};