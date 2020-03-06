import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// let options;

// if (process.env.NODE === 'production') {
// 	options = {
// 		host: `${process.env.EMAIL_HOST}`,
// 		port: `${process.env.EMAIL_HOST_PORT}`,
// 		// secure: `${process.env.EMAIL_HOST_SECURE}`, // true for 465, false for other ports
// 		auth: {
// 			user: `${process.env.EMAIL_ID}`,
// 			pass: `${process.env.EMAIL_PASS}`
// 		}
// 	};
// } else {
// 	options = {
// 		host: `${process.env.EMAIL_HOST}`,
// 		port: `${process.env.EMAIL_HOST_PORT}`,
// 		// secure: `${process.env.EMAIL_HOST_SECURE}`, // true for 465, false for other ports
// 		auth: {
// 			user: `${process.env.EMAIL_ID}`,
// 			pass: `${process.env.EMAIL_PASS}`
// 		}
// 	};
// }
export const options = {
	host: `${process.env.EMAIL_HOST}`,
	port: 587,
	// secure: true, // true for 465, false for other ports
	auth: {
		user: `${process.env.EMAIL_ID}`,
		pass: `${process.env.EMAIL_PASS}`
	}
};

export const transporter = nodemailer.createTransport(options);
