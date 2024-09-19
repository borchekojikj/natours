const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

// new Email(user, url).sendWelcome;
// User is a Object with data

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `<Admin<${process.env.EMAIL_FORM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    // 2) Define the E-Mail Options
    const mailOptions = {
      from: this.from, // Corrected from 'form' to 'from'
      to: this.to,
      subject,
      html,
      text: convert(html)
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours App!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token! (valid for 10 minutes)'
    );
  }
};

// const sendEmail = async options => {
// 1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
//   // Active in gmail "less secure app" option
// });
// 2) Define the email options

// const mailOptions = {
//   form: 'Borche Kojikj <hello@jonas.io>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message
//   // html:
// };
// 3) Actually send the email

// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
