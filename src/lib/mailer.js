const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f69ee13204bcba",
    pass: "341c3cc689b82a"
  }
});