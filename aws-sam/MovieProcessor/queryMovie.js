'use strict';
const AWS = require('aws-sdk');
const utils = require('./utils');
const mysql = require('mysql2');



const getField = (field, value) => {
    if (value) {

        let query = '';
        switch (field) {
            case 'release':
                query = ` AND  \`release\` BETWEEN ${mysql.escape(value.from)} AND ${mysql.escape(value.to)}`;
                break;
            case 'decade':
                query = ` AND \`release\` BETWEEN ${mysql.escape(value + '-01-01')} AND ${mysql.escape((value + 10) + '-01-01')}`;
                break;
            case 'keywords':
                query = ` AND (lower(\`keywords\`) LIKE ${mysql.escape(value.toLowerCase() + '%')} OR lower(\`keywords\`) LIKE ${mysql.escape('%|' + value.toLowerCase() + '%')})`;
                break;
            default:
                query = ` AND lower(\`${field}\`) LIKE ${mysql.escape('%' + value.toLowerCase() + '%')}`;
                break;
        }
        return query;
    }
    return '';
}

const getCondition = (genre, decade, keyword, director, actor, country, releaseTime) => {

    return `${getField('genre', genre)} ${getField('decade', parseInt(decade,10))} ${getField('keywords', keyword)} ${getField('director', director)} ${getField('actor', actor)} ${getField('country', country)} ${getField('country', country)} ${getField('release', releaseTime)}`.trim().substring(4);
    //return `${releaseTime ? ' AND \`release\` BETWEEN \'' + releaseTime.from + '\' AND \'' + releaseTime.to + '\' ' : ''} ${genre ? ' AND lower(genre) LIKE ' + utils.clean('$' + genre + '$') : ''}  ${decade ? ' AND \`release\` BETWEEN \'' + decade  + '-01-01\' AND \'' + (parseInt(decade, 10) +  10) + '-01-01\' ' : ''} ${keyword ? 'AND lower(keywords) LIKE  ' + utils.clean(keyword + '$') + ' OR lower(keywords) LIKE ' +  utils.clean('%|'+ keyword + '%') : ''} ${director ? 'AND lower(director) LIKE ' + utils.clean('%' + director + '%') : ''}  ${country ? 'AND lower(country) LIKE ' + utils.clean('%' + country + '%')  : ''}  ${actor ? 'AND lower(cast) LIKE ' + utils.clean('%' + actor + '%') : ''}`.trim().substring(4);
};


const getData = (query) => {

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (err) {
                console.log('DB_ERROR>', err);
                reject(err);
                return;
            }
            connection.end(function(error, results) {
                if (error) {
                    //return "error";
                    reject("DB_CONN_ERROR");
                }
                resolve(rows);
            });
        });

    });
};


module.exports.getMovieList = async(genre, decade, tag, director, actor, country, releaseTime, offset, limit) => {
    try {
        const query = `SELECT COUNT(*) as total FROM moviesdb.movies WHERE ${getCondition(genre, decade, tag, director, actor, country, releaseTime)};SELECT id, title, img, director FROM moviesdb.movies WHERE ${getCondition(genre, decade, tag, director, actor, country, releaseTime)} ORDER BY popularity desc LIMIT ${limit} OFFSET ${offset};`;
        console.log('QUERY_LIST>', query);
        const data = await getData(query);
        console.log('ROWS>', data);
        return { rows: data[1], total: data[0][0].total };
    }
    catch (err) {
        console.error('ERR', err);
        return null;
    }
};


module.exports.getMovie = async(id) => {
    try {
        const query = `SELECT title, cast, director, country, \`release\`, img, overview, recommended, tagline FROM moviesdb.movies WHERE id = ${id}`;
        console.log('QUERY_SELECT>', query);
        const rows = await getData(query);
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }
    catch (err) {
        console.error('ERR', err);
        return null;
    }
};
