// set up node mail
require('dotenv').config();
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

function mailVerifyLink(emailToSend){
  let mailOptions = {
    from: process.env.EMAIL,
    to: emailToSend,
    subject: 'Please verify Link....',
    text: ''
  }
}

function mailLink(emailToSend, linkMade) {
  let mailOptions = {
    from: process.env.EMAIL,
    to: emailToSend,
    subject: 'Sending Email using Node.js',
    text: linkMade
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  mailLink
}
