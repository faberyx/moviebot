const AWS = require('aws-sdk');
const mysql = require('mysql2');

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

module.exports.getRecommended = async(id) => {
    try {
        const query = `SELECT title, cast, director, country, \`release\`, img, overview, recommended, tagline  FROM  moviesdb.movies  m WHERE FIND_IN_SET (m.id, (SELECT replace(q.recommended,'|',',')  FROM moviesdb.movies q WHERE q.id = ${mysql.escape(id)}))`;
        console.log('QUERY_R_SELECT>', query);
        const rows = await getData(query);
        return rows;
    }
    catch (err) {
        console.error('ERR', err);
        return null;
    }
};




module.exports.getMovie = async(id) => {
    try {
        const query = `SELECT originalTitle, title, cast, genre, director, country, \`release\`, img, overview, backdrop, recommended, vote, tagline, \`runtime\` FROM moviesdb.movies WHERE id = ${mysql.escape(id)}`;
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
