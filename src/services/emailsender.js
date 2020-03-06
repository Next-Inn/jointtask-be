import { transporter } from '../config/nodemailer-config';

const SendMail = (to, token, id) => {
	const hostUrl = process.env.HOST_URL;
	const mailOptions = {
		from: 'admin@jointtaskfoundation.com',
		to,
		subject: 'Welcome To Joint Task Foundation',
		text: `Hi, \n\nThank You For Joining The Joint Task Foundation \nClick on this link to verify your email ${hostUrl}/api/v1/auth/verification?token=${token}&email=${to}&id=${id}`
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return 'error sending verification';
		}
		console.log(`Email sent: ${info.response}`);
	});
};

const sendForgotPasswordMail = (to, token, id) => {
	const hostUrl = process.env.HOST_URL;
	const mailOptions = {
		from: 'admin@jointtaskfoundation.com',
		to,
		subject: 'Your Password Reset Link is Here',
		text: `Hi, \n\nThis Link expires in the next 1 hour\nClick on this link to reset your password ${hostUrl}/api/v1/auth/verification?token=${token}&email=${to}&id=${id}`
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return 'error sending verification';
		}
		console.log(`Email sent: ${info.response}`);
	});
};

const SendAnyMail = (to, subject, message) => {
	const mailOptions = {
		from: 'admin@jointtaskfoundation.com',
		to,
		subject,
		text: `${message}, \n check your profile or dashboard to see the details \n Let us build wealth together`
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return 'error sending verification';
		}
		console.log(`Email sent: ${info.response}`);
	});
};

export { SendMail, sendForgotPasswordMail, SendAnyMail };
