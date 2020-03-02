import { transporter } from '../config/nodemailer-config';

const SendMail = (to, token, id) => {
  const hostUrl = 'https//jointtaskfoundation.herokuapp.com';
  const mailOptions = {
    from: 'admin@jointtaskfoundation.com',
    to,
    subject: 'Let\'s build wealth together',
    text: `Click on this link to verify your email ${hostUrl}/api/v1/auth/verification?token=${token}&email=${to}&id=${id}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return ('error sending verification');
    }
    console.log(`Email sent: ${info.response}`);
  });
};

const SendAnyMail = (to, subject, message) => {
  const mailOptions = {
    from: 'admin@jointtaskfoundation.com',
    to,
    subject,
    text: `${message}, \n check your profile or dashboard to see the details \n Let us build wealth together`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return ('error sending verification');
    }
    console.log(`Email sent: ${info.response}`);
  });
};

export { SendMail, SendJobMail };
