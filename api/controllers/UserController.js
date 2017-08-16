/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const validator = require('validator');

module.exports = {

  signup: function (req, res) {
    let {firstName, lastName, email, password} = req.allParams();

    if(!_.isString(firstName))
      return res.badRequest('Please provide a valid first name');
    if(!_.isString(lastName))
      return res.badRequest('Please provide a valid last name');
    if(!validator.isEmail(email))
      return res.badRequest('Please provide a valid email address');
    if(!_.isString(password) || password.length < 6 || password.length > 12)
      return res.badRequest('Password length must be between 6-12');


    const processRequest = async ()=>{

      const user = await User.create({
        firstName,
        lastName,
        email,
        password
      });

      await UserService.sendActivationEmail(user.email);
      return user;
    };

    processRequest()
      .then(res.ok)
      .catch(err=> rUtil.errorResponse(err, res));
  },

  sendActivationEmail: function (req, res) {
    UserService.sendActivationEmail(req.param('email'))
      .then(()=>{
        res.ok({
          msg: 'Please check your inbox for an activation email from TFT'
        })
      })
      .catch(err=> rUtil.errorResponse(err, res));
  },

  activateAccount: function (req, res) {
    const processRequest = async ()=>{
      let user = await User.update({
        id: req.payload.userId,
        isDeleted: false,
        statusId: Status.PENDING
      }, {
        statusId: Status.ACTIVE
      });

      if(!user || !user.length)
        throw new CustomError('Invalid request to process', {status: 404});

      return {msg: 'Your account has been activated successfully. You can login now'};
    };

    processRequest()
      .then(res.ok)
      .catch(err=> rUtil.errorResponse(err, res));
  }
};

