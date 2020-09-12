const mysql = require('mysql2');
const db = require('./database');

/**
 * Get a list of recommended movies of a selected movie
 * @param {string} id Id of the movie to search recommended from
 */
module.exports.getRecommended = async (id) => {
  try {
    const query = `SELECT id, originalTitle, title, cast, genre, director, country, \`release\`, img, overview, backdrop, recommended, vote, tagline, \`runtime\`  FROM  moviesdb.movies  m WHERE FIND_IN_SET (m.id, (SELECT replace(q.recommended,'|',',')  FROM moviesdb.movies q WHERE q.id = ${mysql.escape(
      id
    )}))`;
    console.log('QUERY_R_SELECT>', query);
    const rows = await db.getData(query);
    return rows;
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};

/**
 * Get a list of recommended movies of a selected movie
 * @param {string} id Id of the movie to search recommended from
 */
module.exports.getMovie = async (id) => {
  try {
    const query = `SELECT id, originalTitle, title, cast, genre, director, country, \`release\`, img, overview, backdrop, recommended, vote, tagline, \`runtime\` FROM moviesdb.movies WHERE id = ${mysql.escape(id)}`;
    console.log('QUERY_SELECT>', query);
    const rows = await db.getData(query);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};
