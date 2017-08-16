/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  process: function (req, res) {
     let email = req.param('email'),
       password = req.param('password');

     if(!_.isString(email) || !_.isString(password))
       return res.badRequest('Invalid email or password provided');

     const processRequest = async ()=>{

       let user = await User.findOne({email, isDeleted: false});
       if(!user) throw new CustomError('Invalid email or password', {status: 401});

       const isValidPassword = await user.validatePassword(password);

       if(!isValidPassword)
         throw new CustomError('Invalid email or password', {status: 401});

       if(user.statusId === Status.PENDING)
         throw new CustomError('Please activate your account to use our platform', {status: 401});

       if(user.statusId !== Status.ACTIVE)
         throw new CustomError('This account is not active. Please contact support for help', {status: 401});

        const rsp = {
          user: user,
          token: jwToken.issue({
            user: user.toJSON()
          }, sails.config.LOGIN_TOKEN_EXPIRY)
        };

       user.lastLogin = new Date();
       user.save();

       return rsp;
     };

     processRequest()
       .then(res.ok)
       .catch((err)=>rUtil.errorResponse(err, res));
  }
};

