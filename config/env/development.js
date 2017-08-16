/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    //connection: 'someMongodbServer'
    migrate: 'alter'
  },

  AUTH_SECRET: '84EF59432FB2E6C4A53838F72F1DA',

  LOGIN_TOKEN_EXPIRY: '12 hours',
  ACCOUNT_ACTIVATION_TOKEN_EXPIRY: '12 hours',

  MAILER: 'mywebsite.local',
  BASE_URL: 'http://localhost:1337/'
};
