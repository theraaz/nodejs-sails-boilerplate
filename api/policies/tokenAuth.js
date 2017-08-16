/**
 * tokenAuth
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = function (req, res, next) {
  let token;

  if (req.param('token')) {
    token = req.param('token');

    // We delete the token from param to not mess with blueprints
    //delete req.query.token; Enabled for demo purposes
  }
  else if (req.headers && req.headers['authorization']) {
    let parts = req.headers['authorization'].split(' ');
    if (parts.length === 2) {
      let scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
    }
  } else {
    return res.json(401, {err: 'No Authorization header was found'});
  }

  jwToken.verify(token, function (err, token) {
    if (err) {
      return res.json(401, {err: 'Invalid Token'});
    }

    try{

      User.findOne({
        id: token.user.id,
        status_id: Status.ACTIVE,
        isDeleted: false
      })
        .then(user=>{
          req.token = {user};
          next();
        })
        .catch(err=> rUtil.errorResponse(err, res));

    }
    catch(err){
      rUtil.errorResponse(err, res);
    }

  });
};
