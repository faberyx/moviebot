// @ts-check
const mysql = require('mysql2');
const db = require('./database');

const cleanValue = (fieldvalue) => {
  const value = `${fieldvalue}`.replace(/\ba\b|\bthe\b|\babout\b|\bby\b|\bwith\b|\bof\b|\bfrom\b/gm, '').trim();
  const ftValue = `+"${value}"`
    .replace(/\band\b\s+/gm, '"+"')
    .replace(/\bor\b\s+/gm, '" "')
    .replace(/\bnot\b\s+/gm, '"-"')
    .replace(/\bwithout\b\s+/gm, '"-"')
    .trim();
  return { value, ftValue };
};

/**
 * Build the field conditions based on the type
 * @param {string} field
 * @param {any} fieldvalue
 */
const getField = (field, fieldvalue, condition = 'AND') => {
  if (fieldvalue) {
    let query = '';
    // try to cleanup values of useless stuff
    const v = cleanValue(fieldvalue);
    console.log('GetField>', v);
    switch (field) {
      case 'release':
        query = ` ${condition}   \`release\` BETWEEN ${mysql.escape(fieldvalue.from)} AND ${mysql.escape(fieldvalue.to)}`;
        break;
      case 'decade':
        query = ` ${condition}  \`release\` BETWEEN ${mysql.escape(v.value + '-01-01')} AND ${mysql.escape(parseInt(v.value, 10) + 10 + '-01-01')}`;
        break;
      case 'year':
        query = ` ${condition}  \`release\` BETWEEN ${mysql.escape(v.value + '-01-01')} AND ${mysql.escape(parseInt(v.value, 10) + 1 + '-01-01')}`;
        break;
      case 'cast':
        query = ` ${condition}   MATCH (cast) AGAINST (${mysql.escape(v.ftValue)} IN BOOLEAN MODE)`;
        break;
      case 'keywords':
        query = ` ${condition}   MATCH (keywords, title ) AGAINST (${mysql.escape(v.ftValue)} IN BOOLEAN MODE)`;
        break;
      case 'genre':
        query = ` ${condition}   MATCH (genresearch) AGAINST (${mysql.escape(v.ftValue)} IN BOOLEAN MODE)`;
        break;
      case 'certification':
        query = ` ${condition}  lower(\`${field}\`) = ${mysql.escape(v.value.toLowerCase())}`;
        break;
      default:
        query = ` ${condition}  lower(\`${field}\`) LIKE ${mysql.escape('%' + v.value.toLowerCase() + '%')}`;
        break;
    }
    return query;
  }
  return '';
};

const getRank = (cast, genre, keyword) => {
  if (cast) {
    const v = cleanValue(cast);
    return `, MATCH (cast) AGAINST (${mysql.escape(v.ftValue)} IN BOOLEAN MODE) as rank`;
  }
  if (keyword) {
    const v = cleanValue(keyword);
    return `, MATCH (keywords, title ) AGAINST (${mysql.escape(v.ftValue)} IN BOOLEAN MODE) as rank`;
  }

  return '';
};

/**
 * Build Query Conditions
 * @param {string} genre
 * @param {string} decade
 * @param {string} keyword
 * @param {string} director
 * @param {string} cast
 * @param {string} country
 * @param {Date} releaseTime
 * @returns {string} Query Conditions
 */
const getCondition = (genre, decade, keyword, director, cast, country, releaseTime, year, certification) => {
  return `${getField('genre', genre)} ${getField('decade', parseInt(decade, 10))} ${getField('keywords', keyword)} ${getField('director', director)} ${getField('cast', cast)} ${getField('country', country)} ${getField(
    'country',
    country
  )} ${getField('release', releaseTime)} ${getField('year', year)}  ${getField('certification', certification)}`
    .trim()
    .substring(4);
};

/**
 * Build Query to search all fields based on a string
 * @param {string} searchGlobal
 * @returns {string} Query Conditions
 */
const getGlobalCondition = (searchGlobal) => {
  return `${getField('keywords', searchGlobal)} `.trim().substring(4);
};

/**
 * Retrieves the list of movies based on the slot conditions
 * @param {string} genre
 * @param {string} decade
 * @param {string} keyword
 * @param {string} director
 * @param {string} cast
 * @param {string} country
 * @param {Date} releaseTime
 * @param {number} offset
 * @param {number} limit
 */
module.exports.getMovieList = async (genre, decade, keyword, director, cast, country, releaseTime, year, certification, offset, limit) => {
  try {
    const rank = getRank(cast, genre, keyword);
    const condition = getCondition(genre, decade, keyword, director, cast, country, releaseTime, year, certification);

    const query = `
      SELECT COUNT(*) as total FROM moviesdb.movies WHERE ${condition};
      SELECT id, title, genre, director, country, \`release\`, img, vote ${rank} FROM moviesdb.movies WHERE ${condition} ORDER BY ${rank ? 'rank' : 'popularity'} DESC LIMIT ${limit} OFFSET ${offset};`;
    console.log('QUERY_LIST>', query);
    const data = await db.getData(query, [], true);

    return { rows: data[1], total: data[0][0].total };
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};

/**
 * Retrieves the list of movies based on the slot conditions
 * @param {string} searchGlobal to search
 * @param {number} offset
 * @param {number} limit
 */
module.exports.getSearchGlobal = async (searchGlobal, offset, limit) => {
  try {
    const query = `SELECT COUNT(*) as total FROM moviesdb.movies WHERE ${getGlobalCondition(
      searchGlobal
    )};SELECT  id, title, genre, director, country, \`release\`, img,  vote  FROM moviesdb.movies WHERE ${getGlobalCondition(searchGlobal)} ORDER BY popularity desc LIMIT ${limit} OFFSET ${offset};`;
    console.log('QUERY_LIST>', query);
    const data = await db.getData(query, [], true);

    return { rows: data[1], total: data[0][0].total };
  } catch (err) {
    console.error('ERR', err);
    return null;
  }
};
