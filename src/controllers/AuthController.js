import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';
import { hashPassword, comparePassword } from './../utils/passwordHash';
import uploadImage from './../services/imageuploader';
import token from 'uuid';
import { SendMail, sendForgotPasswordMail } from './../services/emailsender';
import { createToken, verifyToken } from './../utils/processToken';
import { checkExpiredToken } from './../utils/dateChecker';
const { User, Token, UserAncestor } = model;

//Returns token for logged/signup in Users
const userToken = (user) => {
	const { email, name, role, uuid } = user;
	return {
		token: createToken({
			uuid,
			name,
			email,
			role
		})
	};
};

const AuthController = {
	/**
 *
 * User Sign up logic
 */
	async signup (req, res, next) {
		try {
			let user_ref = null;
			// get verify token
			const verifyId = token();
			// create user uuid
			const user_id = token();
			let referees;
			// trims the req.body to remove trailling spaces
			const userData = magicTrimmer(req.body);
			// destructuring user details
			const { name, username, email, password, phone, address, role, refererId } = userData;

			console.log(refererId);
			// validation of inputs
			const schema = {
				name: inValidName('Full name', name),
				email: inValidEmail(email),
				password: inValidPassword(password)
			};

			// return console.log(schema);
			const validateErrors = validate(schema);
			if (validateErrors) return sendErrorResponse(res, 422, validateErrors);

			// checking if the username & email already exist
			const userName = await User.findOne({ where: { username } });
			const registeredEmail = await User.findOne({ where: { email } });
			if (userName) return sendErrorResponse(res, 409, 'Username Already Exist!!');
			if (registeredEmail) return sendErrorResponse(res, 409, 'Email Already Exist!!');

			//hash passwords and save in database
			const hashedPassword = hashPassword(password);
			if (refererId) {
				user_ref = await User.findOne({
					where: { parentId: refererId }
				});
			}
			const newUser = await User.create({
				uuid: user_id,
				username,
				name,
				email,
				address,
				password: hashedPassword,
				phone,
				parentUuid: refererId,
				role:

						role === 'user' ? 'user' :
						'admin'
			});

			//create a binary 64 string for user identity and save user
			await Token.create({
				user_uuid: newUser.dataValues.uuid,
				verifyId
			});

			//send email verification mail
			await SendMail(email, verifyId, newUser.uuid);
			return sendSuccessResponse(res, 201, {
				message: 'Kindly Verify Account To Log In, Thanks!!'
			});
		} catch (e) {
			console.log(e);
			return next(e);
		}
	},

	/**
	 *Verification link confirmation from email link
	 * @query {verifyId} req
	 * @query {uuid} res
	 * @param {*} next
	 */
	async verifyUser (req, res, next) {
		try {
			// extracting the token and id from the query
			const { token, id } = req.params;

			// verify if the token exist
			const verifyToken = await Token.findOne({
				where: {
					user_uuid: id,
					verifyId: token
				}
			});
			if (!verifyToken) return sendErrorResponse(res, 400, 'No User With The Token Supplied!!!');

			// checck if user exist
			const user = await User.findOne({ where: { uuid: id } });
			if (!user) return sendErrorResponse(res, 401, 'User is not available');
			if (user.dataValues.verified === true) return sendErrorResponse(res, 409, 'User is Already Verified!!!');

			// checking if the email link has expired
			const { createdAt } = verifyToken.dataValues;
			// return console.log(createdAt);
			const timeDiff = checkExpiredToken(createdAt);
			if (timeDiff !== 0) {
				return sendErrorResponse(
					res,
					400,
					'Email Link has Expired \n Click this button to get a new verification token'
				);
			}

			//if it passess all the valication
			await User.update(
				{
					verified: true,
					status: 'active'
				},
				{
					where: {
						uuid: id
					}
				}
			);

			// return sendSuccessResponse(res, 200, '<h2>Your Account has been Verified Successfully</h2>');
			return res.redirect(`${process.env.HOST_URL}/user/login`);
		} catch (e) {
			return next(e);
		}
	},

	async getNewEmailToken (req, res, next) {
		try {
			const verifyId = token();
			const { email } = req.body;

			// get user and create another token
			const user = await User.findOne({ where: { email } });

			if (!user) return sendErrorResponse(res, 404, 'Email not available, please check and try again');

			// generate another token
			await Token.create({
				verifyId,
				user_uuid: user.dataValues.uuid
			});

			SendMail(email, verifyId, user.dataValues.uuid);
			return sendSuccessResponse(res, 200, 'Link Sent, Please Check your mail and Verify Account, Thanks!!!');
		} catch (e) {
			return next(e);
		}
	},

	async signin (req, res, next) {
		try {
			// extracting user data
			const { email, password, username } = req.body;

			// checking if the user exist
			const user =
				email ? await User.findOne({ where: { email } }) :
				await User.findOne({ where: { username } });

			if (!user) return sendErrorResponse(res, 404, 'User Not Found!!');

			// compare password
			const checkPassword = comparePassword(password, user.dataValues.password);
			if (!checkPassword) return sendErrorResponse(res, 400, 'Incorrect Password');

			// check user verification
			if (!user.dataValues.verified) return sendErrorResponse(res, 401, 'Verify Your Account ');
			const token = userToken(user.dataValues);

			return sendSuccessResponse(res, 200, token);
		} catch (e) {
			return next(e);
		}
	},

	async me (req, res, next) {
		try {
			const user = req.userData;
			const profile = await User.findOne({
				where: { uuid: user.uuid },
				attributes: {
					exclude: [
						'password'
					]
				}
			});
			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return next(e);
		}
	},

	async forgetPassword (req, res, next) {
		try {
			const forgetPasswordId = token();
			const { email } = req.body;
			// check if the email exist
			const user = await User.findOne({ where: { email } });
			if (!user) return sendErrorResponse(res, 500, 'User Not Found!!');

			// create a token to be sent to the user email
			await Token.create({
				user_uuid: user.dataValues.uuid,
				forgetPasswordId
			});
			sendForgotPasswordMail(email, forgetPasswordId, user.dataValues.uuid);
			return sendSuccessResponse(res, 200, 'Password Reset Link Sent ');
		} catch (e) {
			return next(e);
		}
	},

	async verifyPasswordLink (req, res, next) {
		try {
			const { token, id, email } = req.params;
			const verifyToken = await Token.findOne({
				where: {
					user_uuid: id,
					forgetPasswordId: token
				}
			});
			if (!verifyToken) return sendErrorResponse(res, 400, 'No User With The Token Supplied!!!');

			// find user
			const user = await User.findOne({ where: { uuid: id } });
			if (!user) return sendErrorResponse(res, 401, 'User is not available');

			// checking if the email link has expired
			const { createdAt } = verifyToken.dataValues;
			const timeDiff = checkExpiredToken(createdAt);
			if (timeDiff !== 0) {
				return sendErrorResponse(
					res,
					400,
					'Email Link has Expired \n Click this button to get a new verification token'
				);
			}

			return sendSuccessResponse(res, 200, { email, message: 'User Confirmed, redirect to password reset page..' });
		} catch (e) {
			return next(e);
		}
	},

	async resetPassword (req, res, next) {
		try {
			const { email, newPassword } = req.body;
			const hashedPassword = hashPassword(newPassword);
			const user = await User.findOne({ where: { email } });
			if (!user) return sendErrorResponse(res, 500, 'User Not Found!!');
			await User.update(
				{ password: hashedPassword },
				{
					returning: true,
					where: { email }
				}
			);

			return sendSuccessResponse(res, 200, 'Password Reset Successfull ');
		} catch (e) {
			return next(e);
		}
	},

	async updateUser (req, res, next) {
		try {
			let avatar, profileDetails;
			const user = req.userData;
			// trim the body
			const userData = await magicTrimmer(req.body);
			const { name, phone, address } = userData;

			// if there is a image
			if (req.file !== undefined) {
				avatar = await uploadImage(req.file);
				profileDetails = {
					profile_pic: avatar,
					name: name || user.name,
					phone: phone || user.phone,
					address: address || user.address
				};
			}
			else {
				profileDetails = {
					name: name || user.name,
					phone: phone || user.phone,
					address: address || user.address
				};
			}

			const profile = await User.update(profileDetails, {
				returning: true,
				where: { uuid: user.uuid }
			});

			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return next(e);
		}
	},

	// sample hierarchy listing
	async sample (req, res, next) {
		try {
			const user = req.userData;
			const profile = await User.findAll({ hierarchy: true });

			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return sendErrorResponse(res, 500, { error: e, message: 'An error occured' });
		}
	},

	async signUpValidation (req, res) {
		try {
			const validaionDetails = await User.findAll({
				attributes: [
					'uuid',
					'username',
					'email'
				],
				order: [
					[
						'username',
						'ASC'
					]
				]
			}).map((value) => value.get({ plain: true }));
			// return console.log(validaionDetails.length);
			if (validaionDetails.length === 0) return sendErrorResponse(res, 404, { message: 'No Username Found' });
			else return sendSuccessResponse(res, 200, validaionDetails);
		} catch (error) {
			return sendErrorResponse(res, 500, { message: 'An Error Occurred ' });
		}
	},

	// sample hierarchy listing
	async sample (req, res, next) {
		try {
			const user = req.userData;
			const profile = await User.findAll({ hierarchy: true });

			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return sendErrorResponse(res, 500, { error: e, message: 'An error occured' });
		}
	}
};

export default AuthController;
