const AWS = require('aws-sdk');
const query = require('./queryMovie');



exports.handler = async(event, context) => {

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type',
        'Access-Control-Allow-Method': 'GET,POST,OPTIONS',
    };

    try {

        const id = event.pathParameters.id;

        if (!id) {
            return {
                statusCode: 404,
                body: null,
                headers,
            };
        }

        let data;

        switch (event.resource) {
            case '/recommended/{id+}':
                data = await query.getRecommended(id);
                break;
            default:
                data = await query.getMovie(id);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers,
        };

    }
    catch (err) {
        return {
            statusCode: 400,
            body: err.message,
            headers,
        };
    }
};
