/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.unauthorized();
 * return res.unauthorized(err);
 * return res.unauthorized(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.unauthorized('Access denied.');
 * ```
 */

module.exports = function unauthorized(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(401);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 401 ("Unauthorized") response: \n', data);
  } else {
    sails.log.verbose('Sending 401 ("Unauthorized") response');
  }
  if(!_.isUndefined(data.error)){
    data.err = data.error;
    delete data.error;
  }

  if(typeof data == 'string')
    data = {err: data};

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  //if (sails.config.environment === 'production') {
  //    data = undefined;
  //}

  // Serve data as JSON(P) if appropriate
  if (req.param('callback')) {
    return res.jsonp(data);
  } else {
    return res.json(data);
  }
};
