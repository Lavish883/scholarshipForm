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

function mailLink(emailToSend, linkMade, attachmentsGiven = [], subject = "", body = "") {
  if (linkMade != false){
    linkMade = "\nLink to edit: " + linkMade;
  }
  
  let mailOptions = {
    from: process.env.EMAIL,
    to: emailToSend,
    subject: subject,
    text: body + linkMade,
    attachments: attachmentsGiven
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
