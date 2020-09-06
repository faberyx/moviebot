const mysql = require('mysql2');
const AWS = require('aws-sdk');

const getCondition = (genre, decade, keyword, director, actor, country, releaseTime) => {
  return `${releaseTime ? " AND `release` BETWEEN '" + releaseTime.from + "' AND '" + releaseTime.to + "' " : ''} ${
    genre ? " AND lower(genre) LIKE '%" + genre.toLowerCase() + "%'" : ''
  }  ${decade ? " AND `release` BETWEEN '" + decade + "-01-01' AND '" + (parseInt(decade, 10) + 10) + "-01-01' " : ''} ${
    keyword ? "AND lower(keywords) LIKE '%" + keyword.toLowerCase() + "%'" : ''
  } ${director ? "AND lower(director) LIKE '%" + director.toLowerCase() + "%'" : ''}  ${country ? "AND lower(country) LIKE '%" + country.toLowerCase() + "%'" : ''}  ${
    actor ? "AND lower(cast) LIKE '%" + actor.toLowerCase() + "%'" : ''
  }`
    .trim()
    .substring(4);
};

const getData = (query) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });
  console.log(connection);
  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows) => {
      if (err) {
        console.log('DB_ERROR>', err);
        reject(err);
        return;
      }
      connection.end(function (error, results) {
        if (error) {
          //return "error";
          reject('DB_CONN_ERROR');
        }
        resolve(rows);
      });
    });
  });
};

module.exports.getMovieList = async (genre, decade, tag, director, actor, country, releaseTime, offset, limit) => {
  try {
    const query = `SELECT COUNT(*) as total FROM moviesdb.movies WHERE ${getCondition(
      genre,
      decade,
      tag,
      director,
      actor,
      country,
      releaseTime
    )};SELECT id, title, img, director FROM moviesdb.movies WHERE ${getCondition(
      genre,
      decade,
      tag,
      director,
      actor,
      country,
      releaseTime
    )} ORDER BY popularity desc LIMIT ${limit} OFFSET ${offset};`;
    console.log('QUERY_LIST>', query);
    const data = await getData(query);
    console.log('ROWS>', data);
    return { rows: data[1], total: data[0][0].total };
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};

module.exports.getMovie = async (id) => {
  try {
    const query = `SELECT title, cast, director, country, \`release\`, img, overview, recommended, tagline FROM moviesdb.movies WHERE id = ${id}`;
    console.log('QUERY_SELECT>', query);
    const rows = await getData(query);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};
