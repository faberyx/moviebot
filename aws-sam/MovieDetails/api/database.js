const mysql = require('mysql2');
const getSecret = require('./getSecret');

/**
 * Restrieves data from the database based on the query string
 * @param {string} query
 * @param {string[]} params  Parameters to pass to the query
 * @param {boolean} multipleStatements Allows multiple statements in the same query
 */

module.exports.getData = async (query, params, multipleStatements) => {
  const secret = await getSecret();
  const connectionString = JSON.parse(secret);
  console.log(connectionString);
  const connection = mysql.createConnection({
    host: connectionString.host,
    port: connectionString.port,
    user: connectionString.username,
    password: connectionString.password,
    database: connectionString.dbname,
    multipleStatements: multipleStatements || false
  });
  return new Promise((resolve, reject) => {
    connection.query(query, params || [], (err, rows) => {
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
