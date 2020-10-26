const db = require("./database");

/**
 * Retruns an error message in json
 * @param {*} message
 */
const error = (err) => {
  console.info("API ERROR>", err);
  return { error: err.message || err };
};

/**
 * Get a list of recommended movies of a selected movie
 * @param {string} id Id of the movie to search recommended from
 */
module.exports.getRecommended = async (id) => {
  try {
    const query = `
        SELECT m.id, m.originalTitle, m.title, m.cast, m.genre, m.director, m.country, m.\`release\`, m.img, m.overview, m.backdrop, m.recommended, m.vote, m.tagline, m.\`runtime\`
        FROM  moviesdb.movies m 
        WHERE FIND_IN_SET (m.id, (SELECT replace(q.recommended,'|',',')  FROM moviesdb.movies q WHERE q.id = ? ))`;
    console.log("QUERY_R_SELECT getRecommended>", query);
    return await db.getData(query, [id]);
  } catch (err) {
    return error(err);
  }
};

/**
 * Get a list of recommended movies of a selected movie
 * @param {string} id Id of the movie to search recommended from
 */
module.exports.getMovie = async (userid, movieid) => {
  try {
    const query = `
        SELECT  m.id,  m.originalTitle, m.certification,  m.title,  m.cast,  m.genre,  m.director,  m.country,  m.\`release\`,  m.img,  m.overview,  m.backdrop,  m.recommended, 
                m.vote, m.popularity, m.tagline, m.\`runtime\`,  IF(w.movie_id IS NULL, cast(FALSE as json), cast(TRUE as json)) as watchlist, r.rating as user_rating 
        FROM moviesdb.movies m 
        LEFT JOIN moviesdb.user_rating r on r.movie_id = m.id  and r.user_id = ?
        LEFT JOIN moviesdb.user_watchlist w on w.movie_id = m.id  and w.user_id = ? 
        WHERE m.id = ?;`;
    console.log("QUERY_SELECT getMovie>", query);
    const rows = await db.getData(query, [userid, userid, movieid]);
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (err) {
    return error(err);
  }
};

/**
 * Add rating data to database
 * @param {string} userid Id of the movie to search recommended from
 */
module.exports.getWatchlist = async (userid) => {
  try {
    const query = `
        SELECT  m.id,  m.originalTitle, m.certification, m.title,  m.cast,  m.genre,  m.director,  m.country,  m.\`release\`,  m.img,  m.overview,  m.backdrop,  m.recommended,  
                m.vote,  m.popularity, m.tagline, m.\`runtime\`, r.rating as user_rating 
        FROM moviesdb.movies m 
            LEFT JOIN moviesdb.user_rating r on r.movie_id = m.id  and r.user_id = ?
            INNER JOIN moviesdb.user_watchlist w on w.movie_id = m.id and w.user_id= ?`;
    console.log("QUERY_SELECT getWatchlist>", query);
    return await db.getData(query, [userid, userid]);
  } catch (err) {
    return error(err);
  }
};

/**
 * Add movie to user watchlist
 * @param {number} userid
 * @param {number} movieid
 */
module.exports.addWatchlist = async (userid, movieid) => {
  try {
    const query =
      "INSERT INTO `moviesdb`.`user_watchlist` (`user_id`,`movie_id`)VALUES(?,?);";
    console.log("QUERY_SELECT addWatchlist>", query);
    await db.getData(query, [userid, movieid]);
    return true;
  } catch (err) {
    return error(err);
  }
};

/**
 * Remove movie to user watchlist
 * @param {number} userid
 * @param {number} movieid
 */
module.exports.removeWatchlist = async (userid, movieid) => {
  try {
    const query =
      "DELETE FROM `moviesdb`.`user_watchlist` WHERE `user_id` = ? AND `movie_id` = ?;";
    console.log("QUERY_SELECT removeWatchlist>", query);
    await db.getData(query, [userid, movieid]);
    return true;
  } catch (err) {
    return error(err);
  }
};

/**
 * UPSERT user ratings
 * @param {number} userid
 * @param {number} movieid
 * @param {number} rating
 */
module.exports.addRating = async (userid, movieid, rating) => {
  try {
    const query =
      "INSERT INTO `moviesdb`.`user_rating` (`user_id`,`movie_id`, `rating`) VALUES (?,?,?) ON DUPLICATE KEY UPDATE  `rating` = ?;";
    console.log("QUERY_SELECT addRating>", query);
    await db.getData(query, [userid, movieid, rating, rating]);
    return true;
  } catch (err) {
    return error(err);
  }
};

/**
 * Returns movies recommended
 * @param {number} userid
 */
module.exports.getUserRecommendations = async (userid) => {
  try {
    const query = ` SET @average = (SELECT AVG(rating) AS Average from moviesdb.user_rating  WHERE  user_id = ?);
                    SELECT  m.id,  m.originalTitle, m.certification, m.title,  m.cast,  m.genre,  m.director,  m.country,  m.\`release\`,  m.img,  m.overview,  m.backdrop,  m.recommended,  
                            m.vote,  m.popularity, m.tagline, m.\`runtime\`
                    FROM  moviesdb.movies m 
                    WHERE FIND_IN_SET (m.id, 
                                (SELECT  GROUP_CONCAT(replace(m.recommended,'|',',') )  
                                FROM moviesdb.movies m  
                                INNER JOIN moviesdb.user_rating r ON r.movie_id = m.id 
                                WHERE r.user_id = ? AND r.rating > @average
                                LIMIT 4)
                    )
                    ORDER BY  m.popularity DESC
                    LIMIT 25`;
    console.log("QUERY_SELECT getUserRecommendations>", query);
    const result = await db.getData(query, [userid, userid], true);
    // returns only the second query result
    return result[1];
  } catch (err) {
    return error(err);
  }
};
/**
 * REtrieve user ratings
 * @param {number} userid
 */
module.exports.getRatings = async (userid) => {
  try {
    const query = `SELECT  m.id, m.title, m.director, m.img, r.rating  
                   FROM  moviesdb.movies m 
                   INNER JOIN moviesdb.user_rating r on r.movie_id = m.id  and r.user_id = ?
                  `;
    console.log("QUERY_SELECT getRatings>", query);
    return await db.getData(query, [userid]);
  } catch (err) {
    return error(err);
  }
};
