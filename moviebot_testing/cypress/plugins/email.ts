/// <reference types="cypress" />

import { MailSlurp } from 'mailslurp-client';
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    getActivationCode(email) {
      return new Promise((resolve) => {
        // tasks should not resolve with undefined
        sql
          .connect('mssql://SqlUserOtu:DoesNotMatterInDev@otudb/EzetopCom')
          .then((pool) => {
            // Query
            return pool
              .request()
              .input('input_parameter', sql.NVarChar, email)
              .query('SELECT r.ActivationUrl FROM brs_CreateAccountRequest AS r JOIN anatis_User AS u ON r.UserID = u.UserID WHERE u.UserName = @input_parameter');
          })
          .then((result) => {
            resolve(result.recordset[0].ActivationUrl);
          })
          .catch((err) => {
            console.log(err, 'ERROR CONNECTING TO DB');
            resolve(null);
          });
      });
    },
    getForgotPasswordCode(email) {
      return new Promise((resolve) => {
        // tasks should not resolve with undefined
        sql
          .connect('mssql://SqlUserOtu:DoesNotMatterInDev@otudb/EzetopCom')
          .then((pool) => {
            // Query
            return pool
              .request()
              .input('input_parameter', sql.NVarChar, email)
              .query('SELECT r.Token FROM brs_ForgotPasswordRequest AS r JOIN anatis_User AS u ON r.UserID = u.UserID WHERE u.UserName = @input_parameter');
          })
          .then((result) => {
            resolve(result.recordset[0].Token);
          })
          .catch((err) => {
            console.log(err, 'ERROR CONNECTING TO DB');
            resolve(null);
          });
      });
    }
  });
};
