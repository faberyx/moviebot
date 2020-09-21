const db = require('./database');

/**
 * Get a list of recommended movies of a selected movie
 * @param {string} id Id of the movie to search recommended from
 */
module.exports.getRecommended = async (id) => {
  try {
    const query = `SELECT m.id, m.originalTitle, m.title, m.cast, m.genre, m.director, m.country, m.\`release\`, m.img, m.overview, m.backdrop, m.recommended, m.vote, m.tagline, m.\`runtime\`
    FROM  moviesdb.movies m 
    WHERE FIND_IN_SET (m.id, (SELECT replace(q.recommended,'|',',')  FROM moviesdb.movies q WHERE q.id = ? ))`;
    console.log('QUERY_R_SELECT getRecommended>', query);
    const rows = await db.getData(query, [id]);
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
module.exports.getMovie = async (userid, movieid) => {
  try {
    const query = `SELECT  m.id,  m.originalTitle,  m.title,  m.cast,  m.genre,  m.director,  m.country,  m.\`release\`,  m.img,  m.overview,  m.backdrop,  m.recommended,  m.vote,  m.tagline,
      m.\`runtime\`,   IF(w.movie_id IS NULL, cast(FALSE as json), cast(TRUE as json)) as watchlist FROM moviesdb.movies m left  join moviesdb.user_watchlist w on w.movie_id = m.id  and w.user_id = ? WHERE m.id = ? `;
    console.log('QUERY_SELECT getMovie>', query);
    const rows = await db.getData(query, [userid, movieid]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};

/**
 * Add rating data to database
 * @param {string} userid Id of the movie to search recommended from
 */
module.exports.getWatchlist = async (userid) => {
  try {
    const query = `SELECT id, originalTitle, title, cast, genre, director, country,  \`release\`, img, overview, backdrop, recommended, vote, tagline, \`runtime\` FROM 
                    moviesdb.movies m INNER JOIN moviesdb.user_watchlist w on w.movie_id = m.id and w.user_id=?`;
    console.log('QUERY_SELECT getWatchlist>', query);
    const rows = await db.getData(query, [userid]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('ERR', err);
    return false;
  }
};

/**
 * Add movie to user watchlist
 * @param {number} userid
 * @param {number} movieid
 */
module.exports.addWatchlist = async (userid, movieid) => {
  try {
    const query = 'INSERT INTO `moviesdb`.`user_watchlist` (`user_id`,`movie_id`)VALUES(?,?);';
    console.log('QUERY_SELECT addWatchlist>', query);
    const rows = await db.getData(query, [userid, movieid]);
    console.log(rows);
    return true;
  } catch (err) {
    console.error('ERR', err);
    return false;
  }
};

/**
 * Remove movie to user watchlist
 * @param {number} userid
 * @param {number} movieid
 */
module.exports.removeWatchlist = async (userid, movieid) => {
  try {
    const query = 'DELETE FROM `moviesdb`.`user_watchlist` WHERE `user_id` = ? AND `movie_id` = ?;';
    console.log('QUERY_SELECT removeWatchlist>', query);
    const rows = await db.getData(query);
    console.log(rows);
    return true;
  } catch (err) {
    console.error('ERR', err);
    return false;
  }
};

/**
 * Add user ratings
 * @param {number} userid
 * @param {number} movieid
 * @param {number} rating
 */
module.exports.addRating = async (userid, movieid, rating) => {
  try {
    const query = 'INSERT INTO `moviesdb`.`user_rating` (`user_id`,`movie_id`, `rating`)VALUES(?,?,?);';
    console.log('QUERY_SELECT addRating>', query);
    const rows = await db.getData(query, [userid, movieid, rating]);
    console.log(rows);
    return true;
  } catch (err) {
    console.error('ERR', err);
    return false;
  }
};
