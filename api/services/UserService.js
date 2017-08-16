
const validator = require('validator');

module.exports = {


  sendActivationEmail: async (email)=>{

    if(!validator.isEmail(email))
      throw new CustomError('Please provide a valid email address', {status: 400});
    let user = await User.findOne({
      email: email,
      statusId: Status.PENDING,
      isDeleted: false
    });

    if(!user)
      throw new CustomError('Could not find any inactive user with your provided details', {status: 400});

    let activationLink = jwToken.issue({
      route: sails.config.BASE_URL + 'account/activate',
      data: {
        email: email,
        userId: user.id
      }
    }, sails.config.ACCOUNT_ACTIVATION_TOKEN_EXPIRY);

    let msg = `Hello and welcome to COMPANY_NAME_HERE. Please click on the link below to activate your account
      <br><br>
      <a href="${activationLink}">Activate Your Account</a>
      <br>
      Thanks,
      <br>
      Support @ COMPANY_NAME_HERE
    `;

    return await EmailService.sendEmail({
      fromEmail: 'support',
      fromName: 'Support',
      toEmail: user.email,
      toName: `${user.firstName} ${user.lastName}`,
      subject: 'Welcome to COMPANY_NAME_HERE',
      body: msg
    })

  }
};
