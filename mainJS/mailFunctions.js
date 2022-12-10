// set up node mail
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lkumar2024@spyponders.com',
      pass: '#########'
    }
});



function mailLink(emailToSend, linkMade){
    let mailOptions = {
        from: 'lkumar2024@spyponders.com',
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
